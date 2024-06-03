import InfraModel from "../../models/InfraModel.js";

export const editDataInfrastruktur = async(req, res) => {
    try {
        const { id, type, data } = req.body;
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({
                status: "error",
                msg: "API Key is required",
            });
        }
        const infrastrukturItem = await InfraModel.findOne({
            where: {
                id: id,
            },
        });
        if (!infrastrukturItem) {
            return res.status(404).json({
                status: "error",
                msg: "Item not found",
            });
        }
        const convertData = JSON.parse(data);
        console.log(convertData);
        if (type === "validation") {
            if (convertData.status_validation === "Disetujui") {
                infrastrukturItem.submission_status = 4;
            } else if (convertData.status_validation === "Ditolak") {
                infrastrukturItem.submission_status = 3;
            }
            infrastrukturItem.on_validation = data;
        } else if (type === "validation_technique") {
            infrastrukturItem.on_validation_technique = data;
        } else if (type === "process") {
            infrastrukturItem.on_process = data;
        } else if (type === "finish") {
            if (
                convertData.submission_status === "Menyetujui" ||
                convertData.submission_status === "Disetujui"
            ) {
                infrastrukturItem.submission_status = 7;
            } else if (
                convertData.submission_status === "Tidak Menyetujui" ||
                convertData.submission_status === "Ditolak"
            ) {
                infrastrukturItem.submission_status = 8;
            }
            infrastrukturItem.on_finish = data;
        }
        await infrastrukturItem.save();
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