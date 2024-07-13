import { test, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { h } from "vue";
import {
  useDemessifierGuiNotificationsList,
  type ChildrenType,
} from "./notification";
import { type StatusBoxFlavorName } from "./status-box";
import { setActivePinia } from "pinia";

const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false });
setActivePinia(pinia);
const demessifierGuiNotificationsList = useDemessifierGuiNotificationsList();

function getNotificationsList(): number {
  return Object.keys(demessifierGuiNotificationsList.notificationsList).length;
}

test("notificationsList", () => {
  const notifications: {
    id?: string;
    flavor: StatusBoxFlavorName;
    headline: string;
    children: ChildrenType;
    timeout: number | false;
  }[] = [
    {
      flavor: "info",
      headline: "headline 1",
      children: "child is string",
      timeout: false,
    },
    {
      flavor: "warn",
      headline: "headline 2",
      children: ["child is string", "but there are 2"],
      timeout: 7,
    },
    {
      flavor: "success",
      headline: "headline 3",
      children: [h("p", {}, "some text")],
      timeout: 7,
    },
    {
      flavor: "error",
      headline: "headline 4",
      children: h("p", {}, "some text"),
      timeout: false,
    },
  ];
  expect(getNotificationsList()).to.be.equal(0);
  for (let i = 0; i < notifications.length; i++) {
    expect(getNotificationsList()).to.be.equal(i);
    const n = notifications[i];
    n.id = demessifierGuiNotificationsList.addNewNotification(
      n.flavor,
      n.headline,
      n.children,
      n.timeout,
    );
    expect(getNotificationsList()).to.be.equal(i + 1);
    expect(
      demessifierGuiNotificationsList.getOpacityFraction(n.id),
    ).to.be.equal(1);
    expect(demessifierGuiNotificationsList.getIsGone(n.id)).to.be.equal(false);
  }

  // TODO: test timeouts

  for (const n of notifications) {
    expect(
      Object.keys(demessifierGuiNotificationsList.notificationsList),
    ).to.contain(n.id);
    demessifierGuiNotificationsList.removeNotification(n.id as string);
    expect(demessifierGuiNotificationsList.getIsGone(n.id as string)).to.be
      .true;
  }
});
