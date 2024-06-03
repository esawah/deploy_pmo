import bcrypt from "bcrypt"; // Pastikan bcrypt diimpor
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Aplikasi = db.define(
    "list_aplikasi", {
        submission_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        submission_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fields: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: {},
        },
        submission_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        on_validation: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        on_validation_technique: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        on_process: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        on_finish: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    }
);


export default Aplikasi;