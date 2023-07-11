# Backend for "Pink Chat App"
This is a team project.  

## Who we are
 - Nguyễn Minh Châu <https://github.com/ho1ow>
 - Đỗ Trí Dũng <https://github.com/dung8204>
 - Vũ Tùng Lâm <https://github.com/laam-egg>
 - Bùi Tuấn Minh <https://github.com/Asayami>

## Introduction
Proud to be members of **UET Code Camp 2023** training program, we finished our end-of-course project, named "Pink Chat App".  

"Pink Chat App" is a chat app that features typical functionality such as:
 - User sign-up and log-in
 - Direct messaging
 - Group messaging
 - Instant message delivery
 - And certain CRUD operations on users, groups, media, and messages.

This repository contains the **BACKEND** of the app. The FRONTEND part is housed at: <https://github.com/dung8204/Web-UI>.

## Technologies
Technologies used in backend are:
 - ExpressJS
 - MongoDB (mongoose)
 - SocketIO
 - And other technologies present in `package.json`.

## Get started
0. Clone the project into your local machine.
1. Create a `.env` file, following `.env.example`.
2. Run `npm install` (or `pnpm install`).
3. To run the BACKEND development server: `npm run dev` (or `pnpm run dev`).
4. To run the FRONTEND: clone the frontend repo with the link above, then use a server like Apache, XAMPP to serve it. Note that at the time of writing, the frontend part assumes that such public backend information as `API_HOST`, `API_PORT`, and `SOCKET_PORT` be exactly as specified in `.env.example`, so you should copy those values into your `.env` file.
5. Now you should be able to access the app via the FRONTEND path.

## Quick-testing the backend
Follow the 0, 1, 2, 3 steps mentioned in the previous section. There is a minimal, incomplete "frontend" that is served at `${API_HOST}:${API_PORT}/`, the root URL of backend server. Just access it from your browser to quickly test the backend with basic functionality.

## API documentation
You can just develop the frontend utilizing this backend. Documentation for API endpoints and socketio connection usage is available [here](https://docs.google.com/document/d/1ARa5HAU8gZvzUai8KkRRsc83SdQdOScDrbnbrsI_g2g/edit?usp=sharing) as a Google Docs document. The documentation is currently in Vietnamese only.

## License
Copyright (c) 2023 Vu Tung Lam et. al.
This project may only be distributed under the terms of the **3-clause BSD License**. Refer to the file `LICENSE.md`.
