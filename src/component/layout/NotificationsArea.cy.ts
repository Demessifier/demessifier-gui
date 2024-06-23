import NotificationsArea from "./NotificationsArea.vue";
import {
  type DemessifierGuiNotificationsList,
  useDemessifierGuiNotificationsList,
} from "../../provider/notification";
import { pinia } from "../../index";

type NotificationInfo = {
  id: string;
  timeoutSeconds: number;
  endTimeMillis: number;
};
const notificationRegister = {} as { [key: string]: NotificationInfo };

function addNotification(
  store: DemessifierGuiNotificationsList,
  timeoutSeconds: number | false,
): string {
  const id = store.addNewNotification(
    "success",
    "headline",
    "body",
    timeoutSeconds,
  );
  if (timeoutSeconds === false) timeoutSeconds = Infinity;
  const endTimeMillis = Date.now() + timeoutSeconds * 1000;
  notificationRegister[id] = { id, timeoutSeconds, endTimeMillis };
  return id;
}

function removeNotification(
  store: DemessifierGuiNotificationsList,
  id: string,
) {
  store.removeNotification(id);
  notificationRegister[id].endTimeMillis = 0;
}

function testNotifications(store: DemessifierGuiNotificationsList) {
  const gracePeriodMillis = 500; // increase if tests are running on a slow machine
  const now = Date.now();
  const shouldExist = Object.values(notificationRegister).filter(
    (n) => n.endTimeMillis > now,
  );
  const mightExist = shouldExist.filter(
    (n) => n.endTimeMillis > now + gracePeriodMillis,
  );
  const lengthOfPinia = Object.keys(store.notificationsList).length;
  expect(
    lengthOfPinia,
    "pinia store " + Object.keys(store.notificationsList),
  ).to.be.at.least(mightExist.length);
  expect(
    lengthOfPinia,
    "pinia store " + Object.keys(store.notificationsList),
  ).to.be.at.most(shouldExist.length);
  cy.get("div#notifications-backdrop > *").should((notifications) => {
    console.log(notifications.length, mightExist.length);
    expect(notifications.length, "gui component").to.be.at.least(
      mightExist.length,
    );
  });
  cy.get("div#notifications-backdrop > *").should((notifications) => {
    expect(notifications.length, "gui component").to.be.at.most(
      shouldExist.length,
    );
  });
}

describe("NotificationsArea component", () => {
  it("Adds and removes notifications", () => {
    cy.mount(NotificationsArea, {
      global: { plugins: [pinia] },
    });
    const demessifierGuiNotificationsList =
      useDemessifierGuiNotificationsList();

    const specialNotifications = { idToBeClosed: "", idToBeRenewed: "" };

    cy.then(() => {
      expect(
        Object.keys(demessifierGuiNotificationsList.notificationsList),
        "pinia store - init",
      ).to.have.length(0);
    })
      .then(() => {
        cy.get("div#notifications-backdrop > *").should((notifications) => {
          expect(notifications, "gui component - init").to.have.length(0);
        });
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        addNotification(demessifierGuiNotificationsList, 1);
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        addNotification(demessifierGuiNotificationsList, 2);
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        addNotification(demessifierGuiNotificationsList, false);
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        specialNotifications.idToBeClosed = addNotification(
          demessifierGuiNotificationsList,
          2,
        );
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        specialNotifications.idToBeRenewed = addNotification(
          demessifierGuiNotificationsList,
          1,
        );
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        // This wil wait until the condition is met
        cy.get("div#notifications-backdrop > *").should((notifications) => {
          expect(
            notifications.length,
            "Waiting for half of the notifications to disappear",
          ).to.be.at.most(3);
        });
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      })
      .then(() => {
        removeNotification(
          demessifierGuiNotificationsList,
          specialNotifications.idToBeClosed,
        );
      })
      .then(() => {
        testNotifications(demessifierGuiNotificationsList);
      });
  });
});

/* TODO: move to Notifications Area tests
describe("Disappears in time", () => {
  const timeoutSeconds = 2;
  it(`${timeoutSeconds} seconds`, () => {
    cy.mount(StatusBox, {
      props: {
        headlineText: `Gonna disappear in ${timeoutSeconds} seconds`,
        boxFlavorName: getAllStatusBoxFlavors()[0],
        removeInSeconds: timeoutSeconds,
      },
      slots: { default: "Our time is running out..." },
    });
    cy.get("div.status-box").trigger("mouseleave");
    const endTimeMillis = Date.now() + timeoutSeconds * 1000;

    const multiplier = 2;
    for (let i = timeoutSeconds * multiplier + 2; i > 0; i--) {
      cy.get("div.status-box").should((statusBox) => {
        const nowMilliSeconds = Date.now();
        if (nowMilliSeconds + 250 < endTimeMillis) {
          // it should still exist
          expect(statusBox).to.exist;
        } else if (nowMilliSeconds > endTimeMillis) {
          // it shouldn't exist anymore
          expect(statusBox).not.to.exist;
        }
      });
      cy.wait(1000 / multiplier);
    }
    // it shouldn't exist anymore
    cy.get("div.status-box").should((statusBox) => {
      expect(statusBox).to.not.exist;
    });
  });
});
*/