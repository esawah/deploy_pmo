import bcrypt from "bcrypt";
import moment from "moment-timezone";
import { deleteImage } from "../components/UploadImage.js";
import { generateApiKey, generateToken } from "../middleware/VerifyToken.js";
import Users from "../models/UserModel.js";

export const Login = async(req, res) => {
    try {
        const clientTimezone = req.headers["client-timezone"] || "Asia/Jakarta";
        const { email, password, keepLogin } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "error", msg: "Email and password are required" });
        }
        if (!moment.tz.zone(clientTimezone)) {
            return res.status(400).json({ status: "error", msg: "Invalid timezone provided" });
        }
        const user = await Users.findOne({ where: { email } });
        if (!user || !await user.comparePassword(password)) {
            return res.status(400).json({ status: "error", msg: "Invalid email or password" });
        }

        user.activeSession = null;
        await user.save();

        const token = generateToken(user, keepLogin);

        user.activeSession = token;
        await user.save();

        res.status(200).json({
            status: "ok",
            msg: "Successful login.",
            token: token,
            apiKey: user.apiKey,
            // clientTimezone: `Data processed using timezone: ${clientTimezone}`,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const Logout = async(req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const user = await Users.findOne({ where: { activeSession: token } });
        console.log(user);
        if (user) {
            user.activeSession = null;
            await user.save();
        }

        res.status(200).json({ status: "ok", msg: "Successfully logged out." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getUser = async(req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const user = await Users.findOne({
            where: { apiKey: apiKey },
            attributes: ["fullname", "email", "address", "telp", "role", "image"],
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                msg: "No user found with the provided API key",
            });
        }

        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};

export const getListUser = async(req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const listuser = await Users.findAll({
            attributes: [
                "id",
                "fullname",
                "email",
                "address",
                "telp",
                "status_account",
                "role",
                "image",
                "createdAt",
                "updatedAt",
            ],
        });
        const totalItems = listuser.length;
        const totalItemsByStatus = {
            aktif: listuser.filter((user) => user.status_account === "Aktif").length,
            nonaktif: listuser.filter((user) => user.status_account === "Non Aktif").length,
        };
        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: listuser,
            totalItems: totalItems,
            totalItemsByStatus: totalItemsByStatus,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};

export const getUserById = async(req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: "error",
                msg: "User ID is required in the request body",
            });
        }

        const user = await Users.findByPk(id, {
            attributes: [
                "fullname",
                "email",
                "address",
                "telp",
                "status_account",
                "role",
                "image",
                "createdAt",
            ],
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                msg: "User not found",
            });
        }

        res.json({
            status: "ok",
            msg: "User details retrieved successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};


export const createUsers = async(req, res) => {
    try {
        const { fullname, email, address, role, image, telp, password } = req.body;
        const apiKey = req.headers["x-api-key"];

        console.log(req.body);
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const existingUser = await Users.findOne({
            where: {
                email: email,
            },
        });
        if (existingUser && existingUser.email) {
            return res.status(400).json({
                status: "error",
                msg: "A user with the same email already exists.",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await Users.create({
            apiKey: generateApiKey(20),
            fullname,
            email,
            role,
            address,
            image,
            telp,
            password: hashPassword,
            status_account: "Aktif",
        });
        res.json({
            status: "ok",
            msg: "Successfully created the user.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};

export const deleteUsers = async(req, res) => {
    try {
        const { id } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const usersDeskItem = await Users.findOne({
            where: {
                id: id,
            },
        });
        if (!usersDeskItem) {
            return res.status(404).json({
                status: "error",
                msg: "Users item not found",
            });
        }
        if (usersDeskItem.image) {
            const fileName = usersDeskItem.image;
            await deleteImage(fileName, "users");
        }
        const deletedItem = await Users.destroy({
            where: {
                id: id,
            },
        });
        if (deletedItem) {
            res.status(200).json({
                status: "ok",
                msg: "Users item deleted successfully",
            });
        } else {
            res.status(404).json({
                status: "error",
                msg: "Users item not found",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};

export const checkRoleUser = async(req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }

        const listuser = await Users.findAll({
            attributes: ["role"],
        });
        const existingRoles = listuser.map((user) => user.role);
        const rolesList = [{
                value: "perangkat_daerah",
                label: "Perangkat Daerah",
                isDisabled: false,
            },
            { value: "kadis", label: "Kepala Dinas", isDisabled: false },
            {
                value: "sekretariat",
                label: "Kepala Bidang Sekretariat",
                isDisabled: false,
            },
            {
                value: "kabid_infra",
                label: "Kepala Bidang Infrastruktur Teknologi, Informasi dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "kabid_desiminasi",
                label: "Kepala Bidang Desiminasi Informasi",
                isDisabled: false,
            },
            {
                value: "kabid_perencanaan",
                label: "Kepala Bidang Perencanaan teknologi,Informasi,dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "kabid_upt_radio",
                label: "Kepala Bidang UPT RADIO SONATA",
                isDisabled: false,
            },
            {
                value: "kabid_aplikasi",
                label: "Kepala Bidang Aplikasi Informatika,Persandian dan Keamanan Informasi",
                isDisabled: false,
            },
            {
                value: "katim_sek",
                label: "Ketua Tim Pokja Sekretariat",
                isDisabled: false,
            },
            {
                value: "katim_infra",
                label: "Ketua Tim Pokja Bidang Infrastruktur Teknologi, Informasi dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "katim_desiminasi",
                label: "Ketua TIm Pokja Desiminasi Informasi",
                isDisabled: false,
            },
            {
                value: "katim_perencanaan",
                label: "Ketua TIm Pokja Perencanaan teknologi,Informasi dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "katim_upt_radio",
                label: "Ketua Tim Pokja UPD RADIO SONATA",
                isDisabled: false,
            },
            {
                value: "katim_aplikasi",
                label: "Ketua Tim Pokja Aplikasi Informatika,Persandian an Keamanan Informasi",
                isDisabled: false,
            },
            {
                value: "teknis_sek",
                label: "Anggota Tim Pokja Sekretariat",
                isDisabled: false,
            },
            {
                value: "teknis_infra",
                label: "Anggota Tim Pokja Bidang Infrastruktur Teknologi, Informasi dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "teknis_desiminasi",
                label: "Anggota TIm Pokja Desiminasi Informasi",
                isDisabled: false,
            },
            {
                value: "teknis_perencanaan",
                label: "Anggota TIm Pokja Perencanaan teknologi,Informasi dan Komunikasi",
                isDisabled: false,
            },
            {
                value: "teknis_upt_radio",
                label: "Anggota Tim Pokja UPD RADIO SONATA",
                isDisabled: false,
            },
            {
                value: "teknis_aplikasi",
                label: "Anggota Tim Pokja Aplikasi Informatika,Persandian an Keamanan Informasi",
                isDisabled: false,
            },
        ];

        const updatedRolesList = rolesList.map((role) => {
            if (existingRoles.includes(role.value)) {
                if (role.value === "perangkat_daerah" || role.value === "teknis_infra" || role.value === "teknis_aplikasi") {
                    return {...role, isDisabled: false };
                } else {
                    return {...role, isDisabled: true };
                }
            }
            return role;
        });

        res.json({
            status: "ok",
            msg: "Data retrieved successfully",
            data: updatedRolesList,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};