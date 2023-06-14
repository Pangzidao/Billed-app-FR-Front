/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from '../containers/Bills.js'
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"
import '@testing-library/jest-dom/extend-expect';



describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            expect(windowIcon).toHaveClass("active-icon"); //TODO 5
      
          })
        test("Then bills should be ordered from earliest to latest", () => {
            const html = BillsUI({ data: bills })
            document.body.innerHTML = html
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => (a < b ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
    })
    describe("When I am on Bills Page and I click on the icon eye", () => {
        test("Then it should open the modal", () => {
            // setting up the initial conditions by creating the HTML representation of the Bills
            const html = BillsUI({
                data: bills
            });
            document.body.innerHTML = html;
            // initialisation bills
            const store = null;
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const billsList = new Bills({ document, onNavigate, store, localStorage: window.localStorage, });
            // simulation modale
            $.fn.modal = jest.fn();
            
            // Retrieve the "eye" icon element
            const icon = screen.getAllByTestId('icon-eye')[0];

            // Define the event handler function for the icon click
            const handleClickIconEye = jest.fn(() =>
                billsList.handleClickIconEye(icon)
            );
            
            // Attach the event listener to the icon
            icon.addEventListener('click', handleClickIconEye);

            // Trigger the click event on the icon
            fireEvent.click(icon);
                
            // Check if the event handler function has been called
            expect(handleClickIconEye).toHaveBeenCalled();

            // Check if the modal element with the id 'modaleFile' exists
            const modale = document.getElementById('modaleFile');
            expect(modale).toBeTruthy();
        })
    })
    describe("When I click on 'Send a new bill' page", () => {
        test("Then I should be sent to 'New bill page'", () => {
            // page bills
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            // initialisation bills
            const store = null;
            const billsList = new Bills({ document, onNavigate, store, localStorage: window.localStorage, });
            // fonctionnalité navigation
            const newBill = jest.fn(() => billsList.handleClickNewBill)
            const navigationButton = screen.getByTestId('btn-new-bill');
            navigationButton.addEventListener('click', newBill);
            fireEvent.click(navigationButton)
            expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
        })
    })
})
// Test suite for integration tests related to GET requests

// Test: Fetch bills from mock API GET
describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to the Bills page", () => {
      test("It should fetch bills from the mock API using GET", () => {
        // Set up the initial conditions
  
        // Mock the local storage
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
  
        // Create the root element and append it to the document body
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
  
        // Mock navigation
        const pathname = ROUTES_PATH['Bills'];
        root.innerHTML = ROUTES({ pathname: pathname, loading: true });
  
        // Create an instance of the Bills class
        const bills = new Bills({ document, onNavigate, store: mockStore, localStorage });
  
        // Fetch bills from the mock API using GET and assert the result
        bills.getBills().then(data => {
          root.innerHTML = BillsUI({ data });
          expect(document.querySelector('tbody').rows.length).toBeGreaterThan(0);
        });
      });
    });
  
    describe("When an error occurs on the API", () => {
      beforeEach(() => {
        // Set up the initial conditions before each test
  
        // Spy on the mockStore's "bills" method
        jest.spyOn(mockStore, "bills");
  
        // Mock the local storage
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }));
  
        // Create the root element and append it to the document body
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
  
        // Initialize the router
        router();
      });
  
      // Test: Fetch bills from the API and handle a 404 error
      test("It should fetch bills from the API and handle a 404 error message", async () => {
        // Create the HTML for the BillsUI component with the 404 error message
        const html = BillsUI({ error: 'Erreur 404' });
        document.body.innerHTML = html;
  
        // Get the error message element and assert its presence
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
  
      // Test: Fetch bills from the API and handle a 500 error
      test("It should fetch bills from the API and handle a 500 error message", async () => {
        // Create the HTML for the BillsUI component with the 500 error message
        const html = BillsUI({ error: 'Erreur 500' });
        document.body.innerHTML = html;
  
        // Get the error message element and assert its presence
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
  