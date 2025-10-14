# Weather Shopper - Automated Testing Project

This repository contains automated tests for the Weather Shopper e-commerce website as part of an interview assessment. The project demonstrates end-to-end testing capabilities using Playwright.

## 🌐 Target Website

**URL:** https://weathershopper.pythonanywhere.com/

## 📋 Test Scenarios

### Weather-Based Product Selection

The application logic determines which products to shop for based on current weather conditions:

- **Temperature < 19°C:** Shop for moisturizers
- **Temperature > 34°C:** Shop for sunscreens

### Sunscreen Shopping Requirements

When the weather is above 34 degrees, the test should:

1. **Add two specific sunscreens to cart:**

   - First: Select the **least expensive sunscreen with SPF-50**
   - Second: Select the **least expensive sunscreen with SPF-30**

2. **Complete the purchase flow:**
   - Verify shopping cart contents are correct
   - Fill out payment details using valid test card numbers
   - Submit the payment form

### Payment Testing

- **Test Cards:** Use Stripe test card numbers (Google "Stripe test card numbers" for valid options)
- **Expected Behavior:** Payment screen intentionally errors 5% of the time by design

## 🛠 Technology Stack

- **Testing Framework:** Playwright
- **Language:** TypeScript/JavaScript
- **Configuration:** `playwright.config.ts`

## 📁 Project Structure

```
wheather-shopper/
├── tests/
│   └── example.spec.ts          # Test specifications
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SmilykR/wheather-shopper.git
cd wheather-shopper
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests with debug mode
npx playwright test --debug
```

## 🧪 Test Cases Covered

- [x] Weather condition detection
- [x] Product category selection based on temperature
- [x] Sunscreen selection by SPF and price criteria
- [x] Shopping cart verification
- [x] Payment form completion
- [x] Error handling for payment failures

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## 🔧 Configuration

Test configuration can be modified in `playwright.config.ts`:

- Browser settings (Chrome, Firefox, Safari)
- Viewport dimensions
- Test timeouts
- Retry logic
- Reporter options

## 📝 Interview Assessment Notes

This project demonstrates:

- **E2E Testing Skills:** Complete user journey automation
- **Dynamic Logic:** Weather-based decision making
- **Data-Driven Testing:** Price and specification-based product selection
- **Error Handling:** Payment failure scenarios
- **Best Practices:** Page Object Model, proper waits, assertions

## 🤝 Contributing

This is an interview project. For any questions or clarifications, please reach out.

## 📄 License

This project is created for educational and assessment purposes.
