const User = require('../models/User/user')
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();


const auth = require('../router/User/auth');
const user = require('../router/User/user');
const role = require('../router/User/role');
const product = require('../router/Product/product');
const category = require('../router/Product/category');
const primaryUnit = require('../router/Product/primaryUnit');
const secondaryUnit = require('../router/Product/secondaryUnit');
const brand = require('../router/Product/brand');
const customer = require('../router/Customer/customer');
const customerGrade = require('../router/Customer/customerGrade');
const customerCategory = require('../router/Customer/customerCategory');
const tax = require('../router/Product/tax');
const vendor = require('../router/vendor');
const purchaseEntry = require('../router/Purchases/purchaseEntry');
const purchaseEntryDetails = require('../router/Purchases/purchaseEntryDetails');
const purchaseOrder =  require('../router/Purchases/purchaseOrder');
const purchaseOrderDetails = require('../router/Purchases/purchaseOrderDetails');
const purchaseInvoice = require('../router/Purchases/purchaseInvoice')
// ROUTE
const vehicle = require('../router/route/vehicle');
const route = require('../router/route/route');
const routeDetails = require('../router/route/routeDetails');
const collectionDays = require('../router/route/collectionDays');
const pickList = require('../router/route/pickList');
const pickListDetails = require('../router/route/pickListDetails');
const dailyCollection = require('../router/route/dailyCollection');
const trip = require('../router/route/trip');
const tripDetails = require('../router/route/tripDetails');
const deliveryDays = require('../router/route/deliveryDays');
// STOCK
const purchaseTransaction = require('../router/Stock/purchaseTransaction');
const stock = require('../router/Stock/stock');
const salesTransaction = require('../router/Stock/salesTransaction');

const syncModel = require('../utils/association');

const sequelize = require('../utils/db');


const app = express();

app.use(cors({orgin:'*'}))

app.use(express.json());

//static Images Folder
app.use('/images', express.static('../images'))

syncModel()

app.use('/login', auth);
app.use('/register', user);
app.use('/role', role);
app.use('/product', product);
app.use('/category',category);
app.use('/primaryunit',primaryUnit);
app.use('/secondaryunit',secondaryUnit);
app.use('/brand',brand);
app.use('/customer',customer);
app.use('/customergrade', customerGrade);
app.use('/customercategory', customerCategory);
app.use('/tax', tax);
app.use('/vendor', vendor);

app.use('/purchaseentry', purchaseEntry);
app.use('/purchaseentrydetails', purchaseEntryDetails);
app.use('/purchaseorder', purchaseOrder);
app.use('/viewpurchaseorder',purchaseOrderDetails);
app.use('/invoices', purchaseInvoice)

app.use('/vehicle', vehicle);
app.use('/route', route);
app.use('/routedetails', routeDetails);
app.use('/routedays', collectionDays);
app.use('/picklist', pickList);
app.use('/picklistdetails', pickListDetails);
app.use('/dailycollection', dailyCollection);
app.use('/trip', trip);
app.use('/tripdetails', tripDetails);
app.use('/tripdays', deliveryDays);
app.use('/stock', stock);
app.use('/purchasetransaction', purchaseTransaction)
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
