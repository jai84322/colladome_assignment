# Radon

## Project - Colladome_assignment-Event_Management

### Key points
- Created a database `colladome_assignment`. 
- Branch name is `backend`

### Models
- User Model
```yaml
{ 
  fname: {string, mandatory},
  lname: {string, mandatory},
  gender: {string, mandatory, enum[Male, Female, Other]},
  email: {string, mandatory, valid email, unique}, 
  password: {string, mandatory, minLen 8, maxLen 25},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

- Event Model
```yaml
{ 
  title: {string, mandatory},
  description: {string, mandatory}, 
  createdBy: {string, mandatory},
  userId: {ObjectId, mandatory, refs to user model},
  invitee: {[ObjectId], mandatory},
  date: {Date, mandatory},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
```


## User APIs 
### POST /register
- Create a user document from request body.
- Returned HTTP status 201 on a succesful user creation. Also returned the user document. The response is a JSON object like [this](#successful-response-structure)
- Returned HTTP status 400 if no params or invalid params received in request body. The response is a JSON object like [this](#error-response-structure)

### POST /login
- Here I have allowed a user to login with their email and password.
- On a successful login attempt returned a JWT token contatining the userId, exp, iat. 
- If the credentials are incorrect returned a suitable error message with a valid HTTP status code. 

### PUT /users/:id (for changing password)
- Here I have created an api for user to change their password.
- User will be giving their userId in path params and after validating userId and token user is allowed to change the password.
- Authentication middleware is implemented here
- If the credentials are incorrect returned a suitable error message with a valid HTTP status code. 

### POST /logout
- Here I have created an api for user to logout. 
- Authentication middleware is implemented here
- If the credentials are incorrect returned a suitable error message with a valid HTTP status code. 

### PUT /updatePassword (for updating password in case of forgot)
- This api is connected with reset password for allowing user to reset their password when they forget it.
- User will be giving hash token and will also be giving new password after validating user is allowed to update the password.
- If the credentials are incorrect returned a suitable error message with a valid HTTP status code. 

### POST /resetPassword (in case of forgetting the password)
- Here I have created an api where user will be giving their email and then user is validated. 
- In response user will get a token to use with "/updatePassword" api.
- If the credentials are incorrect returned a suitable error message with a valid HTTP status code. 



## Events API
### POST /events
- Created a event document from request body.
- Authentication middleware is implemented here
- Return HTTP status 201 on a succesful event creation. Also returned the book document. 
- Return HTTP status 400 for an invalid request.

### GET /checkEvents/:userId
- This api is used for user to see what all events he has created and what all events he is invited in.
- Authentication middleware is implemented here

### GET /events (filter operations)
- pagination, sorting, search filter by creator name, title, userId
- Authentication middleware is implemented here

### GET /events/:eventId
- This api is for getting specific event. User will be giving eventId in params. 
- Authentication middleware is implemented here

### PUT /events/:eventId
- This api is for updating a specific event. User will be giving eventId in params.
- Authentication middleware is implemented here


### Authentication
- It is implemented on all routes of events api's and logout, change password route of users api's. 

## Response

### Successful Response structure
```yaml
{
  status: true,
  message: 'Success',
  data: {

  }
}
```
### Error Response structure
```yaml
{
  status: false,
  message: ""
}
```

## Collections
## users
```yaml
{
  _id: ObjectId("88abc190ef0288abc190ef02"),
  fname: "John",
  lname: "Doe",
  gender: "Male",
  email: "John@yahoo.com", 
  password: "John@12345",
  "createdAt": "2021-09-17T04:25:07.803Z",
  "updatedAt": "2021-09-17T04:25:07.803Z",
}
```
