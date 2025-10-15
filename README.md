# Weather Shopper - Automated Testing Framework

This repository contains a comprehensive automated testing framework for the Weather Shopper e-commerce website, demonstrating advanced Playwright testing patterns and TypeScript best practices.

## 🌐 Target Website

**URL:** https://weathershopper.pythonanywhere.com/

## 📋 Test Scenarios

### Weather-Based Product Selection Logic

The application implements smart product selection based on real-time weather conditions:

- **Temperature < 19°C:** Automatically navigate to moisturizers section
- **Temperature > 34°C:** Automatically navigate to sunscreens section
- **Temperature 19°C - 34°C:** No shopping required (optimal weather)

### Automated Shopping Requirements

#### Moisturizer Selection (Temperature < 19°C)
- Select products based on configurable criteria (Aloe, almond-based)
- Apply min/max price strategies for optimal selection

#### Sunscreen Selection (Temperature > 34°C)
- **Primary:** Least expensive sunscreen with SPF-50
- **Secondary:** Least expensive sunscreen with SPF-30
- Automatic cart validation and price verification

### E2E Purchase Flow
1. **Smart Product Selection:** AI-driven product filtering based on criteria
2. **Cart Verification:** Automated price calculation and validation using Playwright assertions
3. **Secure Payment Processing:** Stripe integration with test card automation
4. **Error Handling:** Built-in 5% payment failure rate handling

## 🏗️ Architecture & Design Patterns

### Page Object Model (POM) with Integrated Business Logic
- **Consolidated Architecture:** All product logic integrated into page classes
- **Separation of Concerns:** UI elements and business logic in dedicated page classes
- **Reusable Components:** Centralized locator management and smart product selection
- **Maintainable Code:** Easy updates when UI changes

## 🛠 Technology Stack

- **Testing Framework:** Playwright v1.56.0
- **Language:** TypeScript 5.9.3
- **Environment Management:** dotenv
- **Code Quality:** Prettier for formatting
- **CI/CD Ready:** Comprehensive script automation

## 📁 Project Structure

```
wheather-shopper/
├── src/
│   ├── asserts/
│   │   └── CheckoutPage.asserts.ts   # Validation and assertion logic
│   ├── data/
│   │   ├── Types.ts                  # TypeScript type definitions
│   │   └── ui-data/                  # Test data management
│   │       └── tempRelatedBuy.ts     # Product selection criteria
│   ├── fixtures/
│   │   └── customFixtures.ts         # Playwright custom fixtures
│   ├── pages/
│   │   ├── StartPage.ts              # Weather detection & navigation
│   │   ├── ProductPage.ts            # Product browsing, selection & business logic
│   │   └── CheckoutPage.ts           # Cart verification & payment
│   └── tests/
│       └── tempRelatedBuy.spec.ts    # Main E2E test suite
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── .prettierrc.json                 # Code formatting rules
└── .env                             # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- **Node.js:** Version 14 or higher
- **Package Manager:** npm or yarn
- **Operating System:** Windows, macOS, or Linux

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/SmilykR/wheather-shopper.git
cd wheather-shopper
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Playwright browsers:**
```bash
npm run install:browsers
```

4. **Environment Setup:**
```bash
# Copy .env.example to .env and configure
cp .env.example .env
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run with visible browser
npm run test:headed

# Interactive test debugging
npm run test:debug

# Test with UI mode
npm run test:ui

# View test reports
npm run report
```

### Code Quality Commands

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# TypeScript type checking
npm run type-check

# Run all quality checks
npm run quality
```

## 🧪 Advanced Features

### Dynamic Test Data Management
- **Centralized Criteria:** Product selection rules in dedicated data files
- **Configurable Strategies:** min/max/target price selection algorithms integrated in ProductPage
- **Type-Safe Data:** Full TypeScript support for test data
- **Assertion-Based Validation:** Dedicated assertion classes for reliable test validation

### Robust Error Handling
- **Playwright Assertions:** Built-in expect API for reliable validations
- **Smart Waits:** Automatic element state verification
- **Payment Failures:** Graceful handling of Stripe's designed 5% error rate

### Test Reliability Features
- **Auto-Retry:** Configurable retry logic for flaky tests
- **Network Stability:** Wait for networkidle states
- **Element Validation:** Visibility and enablement checks before interactions

## 📊 Test Reports & Monitoring

### HTML Reports
```bash
# Generate and view detailed test reports
npm run report
```

### Test Coverage
- **E2E Scenarios:** Complete user journey validation
- **Cross-Browser:** Chrome, Firefox, Safari support
- **Mobile Testing:** Responsive design validation
- **API Integration:** Backend service verification

## ⚙️ Configuration

### Environment Variables (.env)
```bash
BASE_URL=https://weathershopper.pythonanywhere.com
TIMEOUT_SHORT=5000
TIMEOUT_MEDIUM=10000
TIMEOUT_LONG=30000
```

### Playwright Configuration
- **Multi-Browser Testing:** Chrome, Firefox, WebKit
- **Parallel Execution:** Optimized test performance
- **Screenshot/Video:** Automatic capture on failures
- **Custom Timeouts:** Per-action timeout configuration

## 🎯 Key Achievements

### Technical Excellence
- ✅ **Simplified Architecture:** All product logic consolidated in ProductPage class
- ✅ **Type Safety:** Full TypeScript implementation
- ✅ **Playwright Best Practices:** Expect API, proper waits, assertions
- ✅ **Maintainable Architecture:** Page Object Model with integrated business logic
- ✅ **Assertion Pattern:** Dedicated assertion classes for validation logic

### Test Coverage
- ✅ **Temperature Detection:** Real-time weather-based navigation
- ✅ **Smart Product Selection:** AI-driven filtering algorithms
- ✅ **Payment Processing:** Stripe integration with error handling
- ✅ **Cross-Platform:** Windows, macOS, Linux compatibility

### Performance Optimizations
- ✅ **Parallel Test Execution:** Multi-worker configuration
- ✅ **Efficient Locators:** Optimized element selection strategies
- ✅ **Smart Waits:** Reduced test flakiness
- ✅ **Resource Management:** Memory and CPU optimization

## 🤝 Contributing

### Development Workflow
1. **Feature Branch:** Create from `main`
2. **Code Quality:** Run `npm run quality` before commits
3. **Testing:** Ensure all tests pass
4. **Documentation:** Update README for significant changes

### Coding Standards
- **TypeScript:** Strict type checking enabled
- **Prettier:** Consistent code formatting
- **Playwright:** Follow official best practices
- **Comments:** Document complex business logic

## 📄 License

This project is created for educational and assessment purposes.

---

**Built with ❤️ using Playwright + TypeScript**
