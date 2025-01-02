describe('Login Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('VITE_CLIENT_URL') + '/login')
  })

  it('renders the Login page correctly', () => {
    cy.contains('Sign in').should('be.visible')
    cy.contains(`If you don't have an account.`).should('be.visible')
    cy.contains('Register here!').should('have.attr', 'href', '/register')
  })

  it('shows validation errors if the form is submitted empty', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Please input your email!').should('be.visible')
    cy.contains('Please input your password!').should('be.visible')
  })

  it('handles server errors during login', () => {
    cy.get('input[name="email"]').type('testmail1729228328296@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.contains('Email has not been authenticated!').should('be.visible')
  })

  it('shows an error when incorrect password is submitted', () => {
    cy.get('input[name="email"]').type('jerry.tran.goldenowl@gmail.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Incorrect password!').should('be.visible')
  })
})
