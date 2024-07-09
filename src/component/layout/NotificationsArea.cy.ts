import NotificationsArea from "./NotificationsArea.vue";
import { useDemessifierGuiNotificationsList } from "../../provider/notification";
import { createTestingPinia } from "@pinia/testing";

type NotificationInfo = {
  id: string;
  timeoutSeconds: number;
  endTimeMillis: number;
};
type NotificationRegister = { [key: string]: NotificationInfo };

describe("NotificationsArea component", () => {
  const notificationRegister = {} as NotificationRegister;
  let demessifierGuiNotificationsList:
    | ReturnType<typeof useDemessifierGuiNotificationsList>
    | undefined = undefined;

  function getDemessifierGuiNotificationsList() {
    if (demessifierGuiNotificationsList) return demessifierGuiNotificationsList;
    throw new Error("Not defined yet.");
  }

  beforeEach(() => {
    cy.mount(NotificationsArea, {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false, createSpy: cy.spy }),
        ],
      },
    });
    demessifierGuiNotificationsList = useDemessifierGuiNotificationsList();
    demessifierGuiNotificationsList.$reset();
    for (let prop in notificationRegister) {
      if (notificationRegister.hasOwnProperty(prop)) {
        delete notificationRegister[prop];
      }
    }
  });

  function addNotification(timeoutSeconds: number | false): string {
    const id = getDemessifierGuiNotificationsList().addNewNotification(
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

  function removeNotification(id: string) {
    getDemessifierGuiNotificationsList().removeNotification(id, true);
    notificationRegister[id].endTimeMillis = 0;
  }

  function testNotifications() {
    const gracePeriodMillis = 500; // increase if tests are running on a slow machine
    cy.then(() => {
      const now = Date.now();
      const shouldExist = (
        Object.values(notificationRegister) as NotificationInfo[]
      ).filter((n) => n.endTimeMillis > now);
      const mightExist = shouldExist.filter(
        (n) => n.endTimeMillis > now + gracePeriodMillis,
      );
      const lengthOfPinia = Object.keys(
        getDemessifierGuiNotificationsList().notificationsList,
      ).length;
      expect(
        lengthOfPinia,
        "pinia store " +
          Object.keys(getDemessifierGuiNotificationsList().notificationsList),
      ).to.be.at.least(mightExist.length);
      expect(
        lengthOfPinia,
        "pinia store " +
          Object.keys(getDemessifierGuiNotificationsList().notificationsList),
      ).to.be.at.most(shouldExist.length);
      cy.get("div#notifications-backdrop > *").should((notifications) => {
        expect(notifications.length, "gui component").to.be.at.least(
          mightExist.length,
        );
      });
      cy.get("div#notifications-backdrop > *").should((notifications) => {
        expect(notifications.length, "gui component").to.be.at.most(
          shouldExist.length,
        );
      });
    });
  }

  it("Is empty in the beginning", function () {
    expect(
      Object.keys(getDemessifierGuiNotificationsList().notificationsList),
      "pinia store - init",
    ).to.have.length(0);
    cy.get("div#notifications-backdrop > *").should((notifications) => {
      expect(notifications, "gui component - init").to.have.length(0);
    });
    testNotifications();
  });

  describe("Add notification 1", function () {
    beforeEach(function () {
      addNotification(1);
    });

    it("Renders all added notifications 1", function () {
      testNotifications();
    });

    describe("Add notification 2", function () {
      beforeEach(function () {
        addNotification(2);
      });

      it("Renders all added notifications 2", function () {
        testNotifications();
      });

      describe("Add notification 3", function () {
        beforeEach(function () {
          addNotification(false);
        });

        it("Renders all added notifications 3", function () {
          testNotifications();
        });

        describe("Add notification 4", function () {
          let idToBeClosed: string = "";

          beforeEach(function () {
            idToBeClosed = addNotification(2);
          });

          it("Renders all added notifications 4", function () {
            testNotifications();
          });

          describe("Add notification 5", function () {
            let idToBeRenewed: string = "";

            beforeEach(function () {
              idToBeRenewed = addNotification(1);
              // TODO: mouse over this one and reset its endTimeMillis:
              // const notification = notificationRegister[idToBeRenewed];
              // notification.endTimeMillis = Date.now() + notification.timeoutSeconds * 1000;
            });

            it("Renders all added notifications 5", function () {
              testNotifications();
            });

            describe("Waiting for half of the notifications to disappear", function () {
              beforeEach(function () {
                cy.get("div#notifications-backdrop > *").should(
                  (notifications) => {
                    expect(
                      notifications.length,
                      "Waiting for half of the notifications to disappear",
                    ).to.be.at.most(3);
                  },
                );
              });

              it("Renders all remaining notifications", function () {
                testNotifications();
              });

              describe("Remove notification", function () {
                beforeEach(function () {
                  removeNotification(idToBeClosed);
                });

                it("Renders all remaining notifications", function () {
                  testNotifications();
                });
              });
            });
          });
        });
      });
    });
  });
});
