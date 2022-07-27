import * as dotenv from "dotenv";
dotenv.config({ path: './config.env' })
import express from "express"
import session from "express-session"
import cors from "cors"
import {
  SetupArgs,
  setup,
  FAKE_USER
} from "./setup/api"

import {indexrouter} from "./routes/home"

const setup_args : SetupArgs = {
  port: 3002,
  username: "doerr@cs.uni-kl.de",
  fallback_user: FAKE_USER
}

const app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  name: 'farmbot_session',
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' , credentials :  false}));

app.use(indexrouter)


setup(setup_args).then(_  => {
  //start the server
  app.listen(setup_args.port, ()=>{
    console.log("Webserver started on port " + setup_args.port);
  });
}).catch( err => {
  console.error(err);
  process.exit();
})
