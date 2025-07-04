const expressR = require("express")
const router = expressR.Router()
const  {isAuthenticatedUser} = require("../middleware/auth.ts")
const {getEmployee, updateEmployee, getSalaryData, getMeterialPdf} = require("../controllers/hrController.ts")


router.route("/get/employee").get(isAuthenticatedUser, getEmployee)
router.route("/update/employee/:id").put(isAuthenticatedUser, updateEmployee)
router.route("/staff/salary").get(isAuthenticatedUser, getSalaryData)
router.route("/genarate/pdf").get(getMeterialPdf)


module.exports = router