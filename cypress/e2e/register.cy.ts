describe('Register Page', () => {
  let uniqueEmail: string

  beforeEach(() => {
    uniqueEmail = `testmail${Date.now()}@example.com`
    cy.visit(Cypress.env('VITE_CLIENT_URL') + '/register')
  })
  
  it('renders the Register page correctly', () => {
    cy.contains('Sign up').should('be.visible')
    cy.contains('If you already have an account.').should('be.visible')
    cy.contains('Login here!').should('have.attr', 'href', '/login')
  })

  it('shows validation errors if the form is submitted empty', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Please input your name!').should('be.visible')
    cy.contains('Please input your email!').should('be.visible')
    cy.contains('Please input your password!').should('be.visible')
  })

  it('submits the form when all fields are filled with unique email', () => {
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type(uniqueEmail)
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.contains('Successfully! Please check your email!').should('be.visible')
  })

  it('handles server errors during registration with existing email', () => {
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('jerry.tran.goldenowl@gmail.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.contains('Email is already registered').should('be.visible')
  })
})
