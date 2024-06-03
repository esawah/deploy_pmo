import Aplikasi from "../../models/Aplikasi.js";

export const getListDataAplikasi = async(req, res) => {
    try {
        const { role } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        } else {
            const aplikasi = await Aplikasi.findAll();
            aplikasi.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const filteredaplikasi = aplikasi.filter((item) => {
                if (!item.role) return false;
                const itemRoles = JSON.parse(item.role);
                return itemRoles.includes(role);
            });

            if (role === "perangkat_daerah") {
                const validaplikasi = filteredaplikasi.filter(
                    (item) => item.apiKey === apiKey
                );

                if (validaplikasi.length === 0) {
                    return res.status(400).json({
                        status: "error",
                        msg: "Item not found",
                    });
                }

                const totalItemsByStatus = {
                    divalidasi: filteredaplikasi.filter(
                        (user) => user.submission_status === 2 || user.submission_status === 4
                    ).length,
                    diproses: filteredaplikasi.filter(
                        (user) => user.submission_status === 6
                    ).length,
                    ditolak: filteredaplikasi.filter(
                        (user) => user.submission_status === 3 || user.submission_status === 5 || user.submission_status === 8
                    ).length,
                    disetujui: filteredaplikasi.filter(
                        (user) => user.submission_status === 7
                    ).length,
                };
                res.json({
                    status: "ok",
                    msg: "Data aplikasi retrieved successfully",
                    data: validaplikasi.map((item) => {
                        const fields = JSON.parse(item.fields);
                        return {
                            id: item.id,
                            name_pic: fields.name_pic,
                            submission_title: item.submission_title,
                            submission_status: item.submission_status,
                            createdAt: item.createdAt,
                        };
                    }),
                    totalItems: validaplikasi.length,
                    totalItemsByStatus: totalItemsByStatus,
                });
            } else {
                // Jika bukan peran perangkat_daerah, kembalikan data tanpa validasi API key
                const totalItemsByStatus = {
                    divalidasi: filteredaplikasi.filter(
                        (user) => user.submission_status === 2 || user.submission_status === 4
                    ).length,
                    diproses: filteredaplikasi.filter(
                        (user) => user.submission_status === 6
                    ).length,
                    ditolak: filteredaplikasi.filter(
                        (user) => user.submission_status === 3 || user.submission_status === 5 || user.submission_status === 8
                    ).length,
                    disetujui: filteredaplikasi.filter(
                        (user) => user.submission_status === 7
                    ).length,
                };
                res.json({
                    status: "ok",
                    msg: "Data aplikasi retrieved successfully",
                    data: filteredaplikasi.map((item) => {
                        const fields = JSON.parse(item.fields);
                        return {
                            id: item.id,
                            name_pic: fields.name_pic,
                            submission_title: item.submission_title,
                            submission_status: item.submission_status,
                            createdAt: item.createdAt,
                        };
                    }),
                    totalItems: filteredaplikasi.length,
                    totalItemsByStatus: totalItemsByStatus,
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Internal Server Error",
        });
    }
};