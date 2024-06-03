import Aplikasi from "../../models/Aplikasi.js";

export const editDataAplikasi = async(req, res) => {
    try {
        const { id, type, data } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const aplikasiItem = await Aplikasi.findOne({
            where: {
                id: id,
            },
        });
        if (!aplikasiItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }
        const convertData = JSON.parse(data);
        console.log(convertData);
        if (type === "validation") {
            if (convertData.status_validation === "Disetujui") {
                aplikasiItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                aplikasiItem.submission_status = 3;
            }
            aplikasiItem.on_validation = data;
        } else if (type === "validation_technique") {
            aplikasiItem.on_validation_technique = data;
        } else if (type === "process") {
            aplikasiItem.on_process = data;
        } else if (type === "finish") {
            if (
                convertData.submission_status === "Menyetujui" ||
                convertData.submission_status === "Disetujui"
            ) {
                aplikasiItem.submission_status = 7;
            } else if (
                convertData.submission_status === "Tidak Menyetujui" ||
                convertData.submission_status === "Ditolak"
            ) {
                aplikasiItem.submission_status = 8;
            }
            aplikasiItem.on_finish = data;
        }
        await aplikasiItem.save();
        return res.status(200).json({
            status: "ok",
            msg: "Item updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};