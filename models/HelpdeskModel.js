import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const HelpDeskFaq = db.define(
  "helpdesk_faq",
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    answer: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

const ListHelpdesk = db.define(
  "list_helpdesk",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    helpdesk_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    helpdesk_title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    apiKey: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    name_pic: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    telp_pic: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    type_tools: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    image_screenshoot: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fileuploaded: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    period: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    submission_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    device_specifications: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    proposed_bandwidth: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    total_tools: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    full_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    on_process: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tool_checking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    work_scheduling: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    submission_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    comment:{
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    role:{
      type: DataTypes.STRING(200),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
  }
);
export { HelpDeskFaq, ListHelpdesk };
