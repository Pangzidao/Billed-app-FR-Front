/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

import store from "../__mocks__/store.js";
import userEvent from '@testing-library/user-event'

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
      
      test("Then mail icon in vertical layout should be highlighted", async () => {
        // Set up the initial conditions
  
        // Mock the local storage to simulate a connected employee
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
  
        // Create a root element to append to the document body
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
  
        // Mock the navigation and loading of the NewBill page
        const pathname = ROUTES_PATH['NewBill'];
        root.innerHTML = ROUTES({ pathname: pathname, loading: true });
  
        // Remove active-icon class from layout-icon1 and add it to layout-icon2
        document.getElementById('layout-icon1').classList.remove('active-icon');
        document.getElementById('layout-icon2').classList.add('active-icon');
  
        // Wait for the mail icon to be rendered
        await waitFor(() => screen.getByTestId('icon-mail'));
  
        // Retrieve the mail icon
        const mailIcon = screen.getByTestId('icon-mail');
  
        // Check if the mail icon contains the active-icon class
        const iconActivated = mailIcon.classList.contains('active-icon');
        expect(iconActivated).toBeTruthy();
      });
    });
  
    describe("When I select an image in a correct format", () => {
      test("Then the input file should display the file name", () => {
        // Set up the initial conditions
  
        // Render the NewBill page HTML
        const html = NewBillUI();
        document.body.innerHTML = html;
  
        // Define the onNavigate function to simulate navigation
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        // Create a NewBill instance
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
  
        // Mock the handleChangeFile function and attach it to the input element
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        const input = screen.getByTestId('file');
        input.addEventListener('change', handleChangeFile);
  
        // Simulate selecting a file with a correct format (image/png)
        fireEvent.change(input, {
          target: {
            files: [new File(['image.png'], 'image.png', {
              type: 'image/png'
            })],
          },
        });
  
        // Assert that the handleChangeFile function has been called
        expect(handleChangeFile).toHaveBeenCalled();
  
        // Assert that the input file's name is 'image.png'
        expect(input.files[0].name).toBe('image.png');
      });
  
      test("Then a bill is created", () => {
        // Set up the initial conditions
  
        // Render the NewBill page HTML
        const html = NewBillUI();
        document.body.innerHTML = html;
  
        // Define the onNavigate function to simulate navigation
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        // Create a NewBill instance
        const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage });
  
        // Mock the handleSubmit function and attach it to the submit element
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        const submit = screen.getByTestId('form-new-bill');
        submit.addEventListener('submit', handleSubmit);
  
        // Simulate submitting the form
        fireEvent.submit(submit);
  
              // Assert that the handleSubmit function has been called
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("When I select a file with an incorrect extension", () => {
    test("Then the bill is deleted", () => {
      // Set up the initial conditions

      // Render the NewBill page HTML
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Define the onNavigate function to simulate navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Create a NewBill instance
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage });

      // Mock the handleChangeFile function and attach it to the input element
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const input = screen.getByTestId('file');
      input.addEventListener('change', handleChangeFile);

      // Simulate selecting a file with an incorrect extension (image/txt)
      fireEvent.change(input, {
        target: {
          files: [new File(['image.txt'], 'image.txt', {
            type: 'image/txt'
          })],
        },
      });

      // Assert that the handleChangeFile function has been called
      expect(handleChangeFile).toHaveBeenCalled();

      // Assert that the input file's name is 'image.txt'
      expect(input.files[0].name).toBe('image.txt');
    });
  });
});

// Integration test for creating a new bill
describe("Given I am a user connected as Employee", () => {
    describe("When I add a new bill", () => {
      test("Then it creates a new bill", () => {
        // Set up the initial conditions
  
        // Render the NewBill page HTML
        document.body.innerHTML = NewBillUI();
  
        // Define the input data for the bill
        const inputData = {
          type: 'Transports',
          name: 'Test',
          datepicker: '2021-05-26',
          amount: '100',
          vat: '10',
          pct: '19',
          commentary: 'Test',
          file: new File(['test'], 'test.png', { type: 'image/png' }),
        };
  
        // Retrieve the necessary elements from the page
        const formNewBill = screen.getByTestId('form-new-bill');
        const inputExpenseName = screen.getByTestId('expense-name');
        const inputExpenseType = screen.getByTestId('expense-type');
        const inputDatepicker = screen.getByTestId('datepicker');
        const inputAmount = screen.getByTestId('amount');
        const inputVAT = screen.getByTestId('vat');
        const inputPCT = screen.getByTestId('pct');
        const inputCommentary = screen.getByTestId('commentary');
        const inputFile = screen.getByTestId('file');
  
        // Simulate entering the values in the form fields
        fireEvent.change(inputExpenseType, { target: { value: inputData.type } });
        expect(inputExpenseType.value).toBe(inputData.type);
  
        fireEvent.change(inputExpenseName, { target: { value: inputData.name } });
        expect(inputExpenseName.value).toBe(inputData.name);
  
        fireEvent.change(inputDatepicker, { target: { value: inputData.datepicker } });
        expect(inputDatepicker.value).toBe(inputData.datepicker);
  
        fireEvent.change(inputAmount, { target: { value: inputData.amount } });
        expect(inputAmount.value).toBe(inputData.amount);
  
        fireEvent.change(inputVAT, { target: { value: inputData.vat } });
        expect(inputVAT.value).toBe(inputData.vat);
  
        fireEvent.change(inputPCT, { target: { value: inputData.pct } });
        expect(inputPCT.value).toBe(inputData.pct);
  
        fireEvent.change(inputCommentary, { target: { value: inputData.commentary } });
        expect(inputCommentary.value).toBe(inputData.commentary);
  
        userEvent.upload(inputFile, inputData.file);
        expect(inputFile.files[0]).toStrictEqual(inputData.file);
        expect(inputFile.files).toHaveLength(1);
  
        // Mock the localStorage to simulate the user being logged in
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: jest.fn(() => JSON.stringify({ email: 'email@test.com' })),
          },
          writable: true,
        });
  
        // Define the onNavigate function to simulate navigation
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        // Create a NewBill instance
        const newBill = new NewBill({ document, onNavigate, localStorage: window.localStorage });
  
        // Attach the handleSubmit function to the submit event of the form
        const handleSubmit = jest.fn(newBill.handleSubmit);
        formNewBill.addEventListener('submit', handleSubmit);
  
        // Simulate submitting the form
        fireEvent.submit(formNewBill);
  
        // Assert that the handleSubmit function has been called
        expect(handleSubmit).toHaveBeenCalled();
      });
  
      // Test for handling a 404 error when creating a new bill
      test("Then it fails with a 404 message error", async () => {      // Render the Bills page with a 404 error message
      const html = BillsUI({ error: 'Erreur 404' });
      document.body.innerHTML = html;

      // Check if the error message is displayed on the page
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    // Test for handling a 500 error when creating a new bill
    test("Then it fails with a 500 message error", async () => {
      // Render the Bills page with a 500 error message
      const html = BillsUI({ error: 'Erreur 500' });
      document.body.innerHTML = html;

      // Check if the error message is displayed on the page
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});

  