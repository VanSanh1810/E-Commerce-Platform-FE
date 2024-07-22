
# Ecomerce Platform

Ecomerce Platform create with React, Socket and MongoDB

> This repository contain 2 project: *MainSite* and *AdminDashboard*

## Table of Contents
-   [Introduction](#Introduction)
-   [Features](#Features)
-   [MainSite](#MainSite)
-   [AdminDashboard](#AdminDashboard)

## Introduction
An ecommerce platform built with MERN stack, and utilizes third party API's. This ecommerce platform enable three main different flows or implementations:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Buyers browse the store categories, products and brands

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Sellers or Merchants manage their own brand component

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Admins manage and control the entire platform components

> This project have an API service associated with it. You can find it [here](https://gitlab.com/kltl-ute/242k/02-be](https://github.com/VanSanh1810/E-Commerce-Platform-BE).


## Tech Stack

- [React](https://react.dev)
- [Next](https://nextjs.org)
- [Socket](https://socket.io)
- [Bootstrap](https://react-bootstrap.github.io)


## Features

- Node provides the backend environment for this application
- Express middleware is used to handle requests, routes
Mongoose schemas to model the application data
- React for displaying UI components
- Redux to manage application's state
- Redux Thunk middleware to handle asynchronous redux actions
- Socket to handle realtime notifies and chats
- Nodemailer for system to send email

## MainSite

- **Location**: `EcomPage/evaranext/evaranextjs`
- **Tech** : Next, Socket, Redux, Bootstrap
- **What you can do here**
    - Sign in, register or reset password (reset link send to email)
    - Browse product from search bar or recommend system (base on user history behavior)
    - Register to become a seller
    - Manage cart, personal infomation (addresses, name, email)
    - Place order without login
    - Payment through VNPay service (testing environment)
    - Message the seller (only for logged in users)
- **Running Tests**
    - Go to project root folder
    ```bash
    cd ./EcomPage/evaranext/evaranextjs

    ```
    - Locate the `.env.local` file and change `NEXT_PUBLIC_SERVER_DOMAIN` variable to match with API service's port
    ```bash
    // Replace serverPort with API service's port
    NEXT_PUBLIC_SERVER_DOMAIN=http://localhost:{serverPort}
    ```
    - Run the project

    ```bash
    npm run dev
    // project with start with url http://localhost:3000
    ```
- Test data

| Email | Password     | Role                |
| :-------- | :------- | :------------------------- |
| `sanhnguyen734@gmail.com` | `123@abc` | **User** |
    
## AdminDashboard

- **Location**: `AdminDashboard/main`
- **Tech** : React, Socket, Redux, Bootstrap
- **What you can do here**
    - Sign in as seller or admin
    - Manage shop product (create, update, soft delete)
    - Manage shop orders (change status, confirm)
    - Change shop profile (image, address, income, shop's classifies)
    - Manage entire platform as admin (product visibility, user status, shop, reports, banner, ship cost)
- **Running Tests**
    - Go to project root folder
    ```bash
    cd ./AdminDashboard/main

    ```
    - Locate the `.env` file and change `REACT_APP_SERVER_DOMAIN` variable to match with API service's port
    ```bash
    // Replace serverPort with API service's port
    REACT_APP_SERVER_DOMAIN=http://localhost:{serverPort}
    ```
    - Run the project

    ```bash
    npm run start
    // project with start with url http://localhost:3006
    ```
- Test data

| Email | Password     | Role                |
| :-------- | :------- | :------------------ |
| `shopcloth@gmail.com` | `123@shop` | **Vendor** |
| `shopgame@gmail.com` | `123@shop` | **Vendor** |
| `admin@gmail.com` | `123@admin` | **Admin** |


- Test card for payment

|  |     |
| :-------- | :------- |
| **Bank** | `NCB` |
| **Card Number** | `9704198526191432198` |
| **Name** | `NGUYEN VAN A` |
| **Date** | `07/15` |
| **OTP Password** | `123456` |

## Authors

- [@VanSanh](https://github.com/VanSanh1810)
- [@TanPhat](https://github.com/TanPhat21242002)

