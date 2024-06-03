import { deleteFiles } from "../../components/UploadFile.js";
import { deleteImage } from "../../components/UploadImage.js";
import Aplikasi from "../../models/Aplikasi.js";

export const deleteDataAplikasi = async(req, res) => {
    try {
        const { id, layanan } = req.body;
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

        const mergedDataProcess = {
            ...JSON.parse(aplikasiItem.on_validation),
            ...JSON.parse(aplikasiItem.on_process),
            ...JSON.parse(aplikasiItem.on_finish),
            ...JSON.parse(aplikasiItem.fields),
        };
        console.log("Merged Data:", mergedDataProcess);
        const findValueByTitle = (data, title) => data[title];

        const fileUploadValue = findValueByTitle(mergedDataProcess, "file_upload");
        const imageScreenshotValue = findValueByTitle(
            mergedDataProcess,
            "image_screenshoot"
        );
        const foundValue = fileUploadValue || imageScreenshotValue;
        if (foundValue) {
            await deleteFiles(foundValue, layanan);
            await deleteImage(foundValue, layanan);
            console.log("Data ditemukan");
            console.log(foundValue, layanan);
        } else {
            console.log("Data tidak ditemukan");
        }
        const deletedItem = await Aplikasi.destroy({
            where: {
                id: id,
            },
        });
        if (deletedItem) {
            res.status(200).json({
                status: "ok",
                msg: "Item deleted successfully",
            });
        } else {
            res.status(404).json({
                status: "error",
                msg: "Item not found",
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