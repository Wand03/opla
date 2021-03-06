/// <reference types="Cypress" />

context("Actions", () => {
  let root = Cypress.env("FRONTEND_URL") || "localhost:8080";
  // https://on.cypress.io/interacting-with-elements

  let ts = Math.floor(Date.now() / 1000);
  let username = `cypress-${ts}`;
  let email = `${username}@opla.ai`;
  let password = `password`;

  let botName = `bot-${username}`;
  let botEmail = `bot-${email}`;

  let buildUrl = (path = "", rootUrl = root) => {
    let separator = (rootUrl.slice(-1) === "/") ? "" : "/";
    return `${rootUrl}${separator}${path}`;
  }

  before(() => {
    cy.visit(buildUrl());
    cy.createUser(email, username, password);
    cy.createBot(botEmail, botName);
  })

  beforeEach(() => {
    cy.visit(buildUrl());
    // conditional from:
    // https://docs.cypress.io/guides/core-concepts/conditional-testing.html#Element-existence
    cy.get('body').then(($body) => {
      if ($body.text().includes('SignIn')) {
        cy.login(username, password);
      }
      else {
        cy.log("no login required")
      }
    })
  });
  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  });

  it("Add webchat plugin", () => {
    cy.visit(buildUrl("admin"));
    cy.contains("Extensions").click();
    cy.contains("Add").first().click();
    cy.contains("webchat-connector").click();
    cy.contains("Save").click();
    cy.contains("Webchat");

    cy.visit(buildUrl("factory"));
    cy.contains("webchat-connector").parent(".switchListItem").get(".mdc-switch__native-control").should("not.be.checked");
    cy.contains("webchat-connector").parent(".switchListItem").find(".mdc-switch").first().click()
    cy.contains("webchat-connector").parent(".switchListItem").get(".mdc-switch__native-control").should("be.checked");
  });

  let newIntentField = () =>
    cy
      .contains("input")
      .parents(".zui-expansion")
      .last()
      .find("[contenteditable]")
      .first();

  let responseField = () =>
    cy
      .contains("output")
      .parents(".zui-expansion")
      .last()
      .find("[contenteditable]")
      .first();

  it("Publish on webchat", () => {
    cy.visit(buildUrl("factory"));
    cy.contains("webchat-connector").parent(".switchListItem").get(".mdc-switch__native-control").should("be.checked");
    cy.contains("Builder").click();

    cy.contains("button", "Create").click();
    newIntentField().type("foo");
    newIntentField().type("{enter}");

    responseField().type("bar");
    responseField().type("{enter}");

    cy.contains("button", "Save").click();
    cy.contains(".mdc-text-field", "Your message")
      .find("input")
      .type("foo{enter}");

    cy.contains(".message", "bar");
    // publish
    cy.contains("Publish").click();
    cy.get(".mdc-list-item__text");
    cy.get(".mdc-list-item__text").contains("Webchat").click();
    // cy.get("#chat-input-field").type("foo");
    // cy.contains("bar");
  });
  
});
