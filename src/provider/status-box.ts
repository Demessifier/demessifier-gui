import { FaIcon } from "./fa-icon";

export const statusBoxIcons: { [key: string]: FaIcon } = Object.freeze({
  success: "fas-circle-check",
  info: "fas-circle-info",
  warn: "fas-circle-exclamation",
  error: "fas-triangle-exclamation",
});

export type StatusBoxTypeName = keyof typeof statusBoxIcons;

export type StatusBoxTypeItem = {
  icon: FaIcon;
};

function getTypeItem(name: StatusBoxTypeName): StatusBoxTypeItem {
  return {
    icon: statusBoxIcons[name],
  };
}

const statusBoxTypePreparation: { [key: string]: StatusBoxTypeItem } = {};
for (const boxType of Object.keys(statusBoxIcons)) {
  statusBoxTypePreparation[boxType] = getTypeItem(boxType);
}
export const statusBoxType = Object.freeze(statusBoxTypePreparation);

export type StatusBoxType = typeof statusBoxType;
