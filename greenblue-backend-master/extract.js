require("./models/user")();
require("./models/user_package")();
const mongoose = require("mongoose");
var User = require("mongoose").model("User");
const UserPackage = require("mongoose").model("UserPackage");
const ExcelJS = require("exceljs");
const bcrypt = require("bcryptjs");
const { setReferrer } = require("./controllers/users");
const fs = require("fs");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const workbook = new ExcelJS.Workbook();
mongoose
  .connect(process.env.MONGOOSE_DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected successfully.");
  });
const called = async () => {
  await workbook.xlsx
    .readFile("users.xlsx")
    .then(async () => {
      const worksheet = workbook.getWorksheet("JoiningDetails");
      await worksheet.eachRow(async (row, rowNumber) => {
        //EXCRUDE 1ST ROW
        if (rowNumber > 1) {
          const phone = `254${parseInt(row.values[11])}`;
          const pack =
            row.values[32] == "Registration,Starter Package( 5.00)"
              ? 0
              : row.values[32] == "Matrix Plan 1(30.00)"
              ? 1
              : row.values[32] == "Matrix Plan 2(150.00)"
              ? 2
              : null;
          //VERIFY NUMBER
          const data = {
            first_name: row.values[2].substring(0, row.values[2].indexOf(" ")),
            last_name: row.values[2].substring(row.values[2].indexOf(" ") + 1),
            phone: phone,
            email: row.values[16],
            password: row.values[1],
            code: row.values[1],
            country_name: "Kenya",
            country_code: "KE",
            referrer: row.values[3],
            createdAt: row.values[5],
            state: row.values[9],
            pack: pack,
          };
          await registerUser(data);
          console.log(data);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const newUserPackage = async (req, pack) => {
  const user = req;
  if (pack > 0) {
    const new_UserPackage = new UserPackage({
      user_id: user._id,
      package_id:
        pack == 1 ? "6433d30ecbbc0b37bbe3c878" : "6433d37425edc74e05e880e1",
      amount: pack == 1 ? 30 : 150,
    });
    await new_UserPackage.save();
  }
};
const registerUser = async (data) => {
  await delay(5000);
  const code = data.code;
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      account_number: code,
      registration_is_complete: {
        status: true,
        stage: "complete",
        strategy: "script",
      },
      country: {
        name: data.country_name,
        code: data.country_code,
        stae: data.state,
      },
      account_status: {
        acc_status: true,
        status_id: "active",
      },
    });
    await user.save();
    // res.json(user);
    await newUserPackage(user, data.pack);
    await setReferrer(data.referrer, user);
    console.log(`${user.first_name} account restored`);
  } catch (error) {
    console.log(error);
  }
};
called();
