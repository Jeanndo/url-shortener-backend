const app = require("../app");
const request = require("supertest");
const { v4: uuidv4 } = require("uuid");

describe("All tests", () => {

    let AuthToken = "";
    let csrfToken = ""
    let shortUrl = ""

    beforeAll(async () => {
        const response = await request(app).get('/api/v1/csrf');
        csrfToken = response.body.csrfToken
    });


  const newUser = {
    username: "jean",
    email: `jean${uuidv4().slice(0, 2)}@gmail.com`,
    password: "pass1234",
  };

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/auth/register")
      .send(newUser);
    expect(response.statusCode).toEqual(201);
  });

  it("should login", async () => {
    const response = await request(app).post("/api/v1/users/auth/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    AuthToken = response.body.data.token;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("message");
  });

  it("should return all users", async () => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${AuthToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("data");
  });


  //URL SHORTENING TESTS

  it('should shorten a long url',async()=>{

    const response = await request(app)
    .post("/api/v1/urls/shorten")
    .send({long_url:"https://managinga.coderenders.com",title:"Managinga"})
    .set("Authorization", `Bearer ${AuthToken}`)
    .set("x-csrf-token",csrfToken)
    .set("Cookie",`_csrf=${csrfToken}`)

    shortUrl = response.body.data.short_code

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('message')
  })

  it('it should get a short url with analytics',async()=>{
    const response = await request(app)
      .get(`/api/v1/urls/analytics/${shortUrl}`)
      .set("Authorization", `Bearer ${AuthToken}`)
      .set("x-csrf-token",csrfToken)
      .set("Cookie",`_csrf=${csrfToken}`)

      expect(response.statusCode).toEqual(200)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('message')
  })

  it('should redirect to original url',async()=>{

    const response =  await request(app).get(`/api/v1/urls/${shortUrl}`)
      expect(response.statusCode).toEqual(302)

  })

  it('should return all urls of current user',async()=>{
      const response = await request(app)
      .get('/api/v1/urls')
      .set("Authorization", `Bearer ${AuthToken}`)
      .set("x-csrf-token",csrfToken)
      .set("Cookie",`_csrf=${csrfToken}`)

      expect(response.statusCode).toEqual(200)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('message')
      
  })
});
