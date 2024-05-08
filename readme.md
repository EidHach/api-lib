# Frontend Setup API

Frontend Setup API is a package that provides a convenient way to interact with APIs in frontend applications using Axios.

## Installation

You can install the `frontend-setup-api` package via npm or yarn:

npm install frontend-setup-api

or

yarn add frontend-setup-api

## Importing:

You can import the API helper class as follows:

import { API } from 'frontend-setup-api';

## Initialization

Initialize the API by providing configuration such as baseURL and headers:

import { API } from 'frontend-setup-api';
import { BASE_URL } from '~/settings';

API.initialize({
baseURL: BASE_URL,
headers: {
'Content-Type': 'application/json',
},
});

## Setting Authentication Token

const token = x

API.updateAuthToken(token);
