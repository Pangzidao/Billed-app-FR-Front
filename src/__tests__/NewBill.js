/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

console.log(NewBillUI)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then something", () => {
      const html = NewBillUI()
      console.log(html)
      document.body.innerHTML = html
      expect(html).toBeTruthy(document.body.innerHTML)
    })
  })
})
