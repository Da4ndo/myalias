![Forks](https://img.shields.io/github/forks/Da4ndo/NestAuthFlow?label=Forks&color=lime&logo=githubactions&logoColor=lime)
![Stars](https://img.shields.io/github/stars/Da4ndo/NestAuthFlow?label=Stars&color=yellow&logo=reverbnation&logoColor=yellow)
![License](https://img.shields.io/github/license/Da4ndo/NestAuthFlow?label=License&color=808080&logo=gitbook&logoColor=808080)
![Issues](https://img.shields.io/github/issues/Da4ndo/NestAuthFlow?label=Issues&color=red&logo=ifixit&logoColor=red)

# NestAuthFlow

A lightweight, secure, and efficient user authentication system built with Nest.js. This project showcases the usage of JSON Web Tokens (JWT) for maintaining user sessions, rate limiting to prevent potential abuse, and built-in data validation for user inputs with a focus on security and simplicity.

This project was built using Node.js v20.4.0.

## Features

- User Registration and Authentication
- JWT Sessions
- Data Validation
- Database usage with [**typeorm**](https://typeorm.io/)

## Planned Enhancements

- Rate Limiting
- CSRF Protection

I tried using these things, but they didn't work very well and had some issues. So for now, I took them out.

## Changelog

v1.1.0 - 18.08.2023:

- Now can login with either username or email.
- Uses database rather then users.json. (sqlite memory)

## Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en)

- [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Da4ndo/NestAuthFlow
```

2. Install the dependencies:

```bash
cd NestAuthFlow
yarn install
```

3. Configure your environment variables:

Open .env and change 'YOUR_SECRET' to your own secret:

```ts
JWT_SECRET = 'YOUR_SECRET';
```

4. Start the server:

```bash
yarn start:dev
```

Your server should now be running at **`http://localhost:4000`**.

## Usage

Here are some example endpoints that you can try:

- **Register a new user**: Send a POST request to http://localhost:4000/users with a JSON body containing the username and password.

- **Login**: Send a POST request to http://localhost:4000/auth/login with a JSON body containing your username and password. You will receive a JWT in response.

- **Access Protected Route**: Send a GET request to http://localhost:4000/administration with the JWT token you received in the Authorization header.

> To test calls to my api, I personally use the Thunder Client vscode plugin.

## Learn More About Nest.js

To learn more about Nest.js, visit [Nest.js documentation](https://docs.nestjs.com/).

# License

This project is licensed under the MIT License. See the **LICENSE** file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
