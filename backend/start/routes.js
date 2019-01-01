'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route
  .post('registration', 'UserController.registration')
  .middleware('guest')

Route
  .post('login', 'UserController.login')
  .middleware('guest')

Route
  .get('logout', 'UserController.logout')
  .middleware('guest')

Route
  .post('edit', 'UserController.edit')
  .middleware(['auth'])

Route
  .get('tmp/uploads/:userpicName', 'UserController.getUserPic')

Route
  .post('notes', 'UserController.saveNote')
  .middleware(['auth'])

Route
  .get('notes', 'UserController.getNotes')
  .middleware(['auth'])

