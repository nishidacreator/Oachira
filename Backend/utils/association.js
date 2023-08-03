const sequelize = require('./db');
const Category = require('../models/Products/category');
const Product = require('../models/Products/product');
const PrimaryUnit = require('../models/Products/primayUnit');
const SecondaryUnit = require('../models/Products/secondaryUnit');
const Brand = require('../models/Products/brand');
const Role = require('../models/User/role');
const User = require('../models/User/user');
const CustomerCategory = require('../models/Customer/customerCategory');
const CustomerGrade = require('../models/Customer/customerGrade');
const Customer = require('../models/Customer/customer');
const Tax = require('../models/Products/tax');
const Vendor = require('../models/vendor');
const PurchaseEntry = require('../models/Purchases/purchaseEntry');
const PurchaseEntryDetails = require('../models/Purchases/purchaseEntryDetails');
const Stock = require('../models/stock');
const Transaction = require('../models/transaction');
const Vehicle = require('../models/route/vehicle');
const Route = require('../models/route/route');
const CollectionDays = require('../models/route/collectionDays');
const RouteDetails = require('../models/route/routeDetails');
const PickList = require('../models/route/pickList');
const PickListDetails = require('../models/route/pickListDetails');
const DailyCollection = require('../models/route/dailyCollection');
const Trip = require('../models/route/trip');
const TripDetails = require('../models/route/tripDetails');
const DeliveryDays = require('../models/route/deliveryDays');
const brandData = require('./brandFirst.json');
const productData = require('./productsOachiraFirst.json');
const categoryData = require('./categoryFirst.json');
const bcrypt = require('bcrypt');

const { JSON } = require('sequelize');

async function syncModel(){

    CustomerGrade.hasMany(Customer, {foreignKey : 'customerGradeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Customer.belongsTo(CustomerGrade)

    CustomerCategory.hasMany(Customer, {foreignKey : 'customerCategoryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Customer.belongsTo(CustomerCategory)

    Category.hasMany(Product,{foreignKey : 'categoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Category)
    
    Brand.hasMany(Product,{foreignKey : 'brandId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    Product.belongsTo(Brand)
    
    PrimaryUnit.hasMany(Product,{foreignKey : 'primaryUnitId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(PrimaryUnit)

    PrimaryUnit.hasMany(SecondaryUnit,{foreignKey : 'primaryUnitId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    SecondaryUnit.belongsTo(PrimaryUnit)

    Role.hasMany(User,{foreignKey : 'roleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    User.belongsTo(Role)

    Vendor.hasMany(PurchaseEntry,{foreignKey : 'vendorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntry.belongsTo(Vendor)

    User.hasMany(PurchaseEntry,{foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntry.belongsTo(User)

    Product.hasMany(Stock, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Stock.belongsTo(Product)

    PrimaryUnit.hasMany(Stock, {foreignKey : 'primaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Stock.belongsTo(PrimaryUnit)

    SecondaryUnit.hasMany(Stock, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Stock.belongsTo(SecondaryUnit)

    Product.hasMany(PurchaseEntryDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntryDetails.belongsTo(Product)

    PurchaseEntry.hasMany(PurchaseEntryDetails,{foreignKey : 'purchaseEntryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntryDetails.belongsTo(PurchaseEntry)

    SecondaryUnit.hasMany(PurchaseEntryDetails, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntryDetails.belongsTo(SecondaryUnit)

    Tax.hasMany(PurchaseEntryDetails, {foreignKey : 'taxId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PurchaseEntryDetails.belongsTo(Tax)
    
    Stock.hasMany(Transaction,{foreignKey : 'stockId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Transaction.belongsTo(Stock)
    
    Customer.hasMany(Transaction, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Transaction.belongsTo(Customer)

    Product.hasMany(Transaction, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Transaction.belongsTo(Product)

    Vehicle.hasMany(Route, {foreignKey : 'vehicleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(Vehicle)

    User.hasOne(Route,{foreignKey : 'driverId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {as: 'driver', foreignKey : 'driverId'})

    User.hasOne(Route, {foreignKey : 'salesManId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {as:'salesman', foreignKey : 'salesManId'})

    User.hasOne(Route, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    Route.hasMany(CollectionDays, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    CollectionDays.belongsTo(Route)

    Route.hasMany(RouteDetails, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteDetails.belongsTo(Route)

    Customer.hasMany(RouteDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteDetails.belongsTo(Customer)

    Route.hasOne(PickList, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PickList.belongsTo(Route)

    Customer.hasOne(PickList, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PickList.belongsTo(Customer)

    User.hasOne(PickList, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PickList.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    Product.hasOne(PickListDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PickListDetails.belongsTo(Product)

    PickList.hasOne(PickListDetails, {foreignKey : 'pickListId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    PickListDetails.belongsTo(PickList)

    Route.hasOne(DailyCollection, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    DailyCollection.belongsTo(Route)

    Customer.hasOne(DailyCollection, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    DailyCollection.belongsTo(Customer)

    User.hasOne(DailyCollection, {foreignKey : 'salesExecutiveId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    DailyCollection.belongsTo(User, {as:'salesexecutive', foreignKey : 'salesExecutiveId'})

    Route.hasOne(Trip, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Trip.belongsTo(Route)

    Trip.hasOne(TripDetails, {foreignKey : 'tripId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    TripDetails.belongsTo(Trip)

    Customer.hasOne(TripDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    TripDetails.belongsTo(Customer)

    Route.hasMany(DeliveryDays, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    DeliveryDays.belongsTo(Route)


    await sequelize.sync({alter : true})

    const role = await Role.findAll({})
    if(role.length === 0){
        Role.bulkCreate([
            {roleName : 'Admin', status: true},
            {roleName : 'Counter', status: true},
            {roleName : 'Salesman', status: true},
            {roleName : 'Driver', status: true},
            {roleName : 'SalesExecutive', status: true}
        ])
    }

    const user = await User.findAll({})
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('asdfgh', salt)
    if(user.length === 0){
        User.bulkCreate([
            {"name": "Sultan", "phoneNumber": "1111111111", "password": hashedPassword, "roleId": 1, "status": true},
            {"name": "Manha", "phoneNumber": "2222222222", "password": hashedPassword, "roleId": 2, "status": true},
            {"name": "Amina", "phoneNumber": "3333333333", "password": hashedPassword, "roleId": 3, "status": true},
            {"name": "Anupama", "phoneNumber": "4444444444", "password": hashedPassword, "roleId": 4, "status": true},
            {"name": "Nishida", "phoneNumber": "5555555555", "password": hashedPassword, "roleId": 5, "status": true}
        ])
    }
    
    const pUnit = await PrimaryUnit.findAll({})
    if(pUnit.length === 0){
        PrimaryUnit.bulkCreate([
            {primaryUnitName : 'Nos', value : 1},
            {primaryUnitName : 'KG', value : 1},
            {primaryUnitName : 'Litre', value : 1},
            {primaryUnitName : 'Meter', value : 1},
            {primaryUnitName : 'Gram', value : 1},
        ])
    }

    const customerCategory = await CustomerCategory.findAll({})
    if(customerCategory.length === 0){
        CustomerCategory.bulkCreate([
           {categoryName : 'Walkin'},
           {categoryName : 'Wholesale'},
           {categoryName : 'Route'},
           {categoryName : 'Ecommerce'},
        ])
    }

    const customerGarde = await CustomerGrade.findAll({})
    if(customerGarde.length === 0){
        CustomerGrade.bulkCreate([
            {grade : 'Normal', gradeRemarks : 'initial customer'}, // initial customer
            {grade : 'Regular', gradeRemarks : 'min 25 transactions'}, // min 25 transactions
            {grade : 'Premium', gradeRemarks : '50 transactions'}, // 50 transactions
            {grade : 'VIP', gradeRemarks : '100 transactions'}, // 100 transactions
            {id : 100, grade : 'Fraud', gradeRemarks : 'bad debtors'}// bad debtors
        ])
    }

    const customer = await Customer.findAll({})
    if(customer.length === 0){
        Customer.bulkCreate([
            {"customerName" : "Nishida", "customerCategoryId" : 2, "customerGradeId" : 1, "phoneNumber" : "1234567890", "address" : "Kerala", "location" : "Thrissur","gstNo" : "84586","email" : "nishida@gmail.com", "remarks" : "remarks"}
        ])
    }
    
    const tax = await Tax.findAll({})
    if(tax.length == 0){
        Tax.bulkCreate([
            {taxName : '5% GST', igst : 5, cgst : 2.5, sgst : 2.5},
            {taxName : '6% GST', igst : 6, cgst : 3, sgst : 3},
            {taxName : '12% GST', igst : 12, cgst : 6, sgst : 6},
            {taxName : '18% GST', igst : 18, cgst : 9, sgst : 9},
            {taxName : '28% GST', igst : 28, cgst : 9, sgst : 9}
        ])

    }

    const brand = await Brand.findAll({})
    if(brand.length == 0){
        for(let i = 0; i < brandData.length; i++){
            Brand.bulkCreate([brandData[i]])
        }
    }

    const category = await Category.findAll({})
    if(category.length == 0) {
        for(let i = 0; i < categoryData.length; i++){
            Category.bulkCreate([categoryData[i]])
        }
    }

    const product = await Product.findAll({})
    if (product.length === 0) {
        for(let i = 0; i < productData.length; i++){
            Product.bulkCreate([productData[i]])
        }
    }
}



module.exports = syncModel