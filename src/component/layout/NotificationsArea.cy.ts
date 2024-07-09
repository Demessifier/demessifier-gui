import NotificationsArea from "./NotificationsArea.vue";
import { useDemessifierGuiNotificationsList } from "../../provider/notification";
import { pinia } from "../../index";

type NotificationInfo = {
  id: string;
  timeoutSeconds: number;
  endTimeMillis: number;
};
type NotificationRegister = { [key: string]: NotificationInfo };

describe("NotificationsArea component", function () {
  beforeEach(function () {
    cy.mount(NotificationsArea, {
      global: { plugins: [pinia] },
    });
    this.demessifierGuiNotificationsList = useDemessifierGuiNotificationsList();
    this.demessifierGuiNotificationsList.$reset();
    // Object.keys(this.demessifierGuiNotificationsList.notificationsList).forEach(
    //   (k) => delete this.demessifierGuiNotificationsList.notificationsList[k],
    // );

    this.notificationRegister = {} as NotificationRegister;

    this.addNotification = function (timeoutSeconds: number | false): string {
      const id = this.demessifierGuiNotificationsList.addNewNotification(
        "success",
        "headline",
        "body",
        timeoutSeconds,
      );
      if (timeoutSeconds === false) timeoutSeconds = Infinity;
      const endTimeMillis = Date.now() + timeoutSeconds * 1000;
      this.notificationRegister[id] = { id, timeoutSeconds, endTimeMillis };
      return id;
    };

    this.removeNotification = function (id: string) {
      this.demessifierGuiNotificationsList.removeNotification(id);
      this.notificationRegister[id].endTimeMillis = 0;
    };

    this.testNotifications = function () {
      const gracePeriodMillis = 500; // increase if tests are running on a slow machine
      cy.then(() => {
        const now = Date.now();
        const shouldExist = (
          Object.values(this.notificationRegister) as NotificationInfo[]
        ).filter((n) => n.endTimeMillis > now);
        const mightExist = shouldExist.filter(
          (n) => n.endTimeMillis > now + gracePeriodMillis,
        );
        const lengthOfPinia = Object.keys(
          this.demessifierGuiNotificationsList.notificationsList,
        ).length;
        expect(
          lengthOfPinia,
          "pinia store " +
            Object.keys(this.demessifierGuiNotificationsList.notificationsList),
        ).to.be.at.least(mightExist.length);
        expect(
          lengthOfPinia,
          "pinia store " +
            Object.keys(this.demessifierGuiNotificationsList.notificationsList),
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
      });
    };
  });

  it("Is empty in the beginning", function () {
    expect(
      Object.keys(this.demessifierGuiNotificationsList.notificationsList),
      "pinia store - init",
    ).to.have.length(0);
    cy.get("div#notifications-backdrop > *").should((notifications) => {
      expect(notifications, "gui component - init").to.have.length(0);
    });
    this.testNotifications();
  });

  describe("Add notification 1", function () {
    beforeEach(function () {
      this.addNotification(1);
    });

    it("Renders all added notifications 1", function () {
      this.testNotifications();
    });

    describe("Add notification 2", function () {
      beforeEach(function () {
        this.addNotification(2);
      });

      it("Renders all added notifications 2", function () {
        this.testNotifications();
      });

      describe("Add notification 3", function () {
        beforeEach(function () {
          this.addNotification(false);
        });

        it("Renders all added notifications 3", function () {
          this.testNotifications();
        });

        describe("Add notification 4", function () {
          beforeEach(function () {
            this.idToBeClosed = this.addNotification(2);
          });

          it("Renders all added notifications 4", function () {
            this.testNotifications();
          });

          describe("Add notification 5", function () {
            beforeEach(function () {
              this.idToBeRenewed = this.addNotification(1);
              // TODO: mouse over this one and reset its endTimeMillis:
              // const notification = this.notificationRegister[this.idToBeRenewed];
              // notification.endTimeMillis = Date.now() + notification.timeoutSeconds * 1000;
            });

            it("Renders all added notifications 5", function () {
              this.testNotifications();
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
                this.testNotifications();
              });

              describe("Remove notification", function () {
                beforeEach(function () {
                  this.removeNotification(this.idToBeClosed);
                });

                it("Renders all remaining notifications", function () {
                  this.testNotifications();
                });
              });
            });
          });
        });
      });
    });
  });
});
