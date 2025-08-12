"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const clients_entity_1 = require("../entities/clients.entity");
const product_entity_1 = require("../products/entities/product.entity");
const journey_plan_entity_1 = require("../journey-plans/entities/journey-plan.entity");
const login_history_entity_1 = require("../entities/login-history.entity");
const uplift_sale_entity_1 = require("../entities/uplift-sale.entity");
const uplift_sale_item_entity_1 = require("../entities/uplift-sale-item.entity");
const task_entity_1 = require("../entities/task.entity");
const leave_entity_1 = require("../entities/leave.entity");
const store_entity_1 = require("../entities/store.entity");
const store_inventory_entity_1 = require("../entities/store-inventory.entity");
const category_entity_1 = require("../entities/category.entity");
const category_price_option_entity_1 = require("../entities/category-price-option.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const users_entity_1 = require("../users/entities/users.entity");
const notice_entity_1 = require("../notices/entities/notice.entity");
const leave_type_entity_1 = require("../entities/leave-type.entity");
const feedback_report_entity_1 = require("../entities/feedback-report.entity");
const product_report_entity_1 = require("../entities/product-report.entity");
const visibility_report_entity_1 = require("../entities/visibility-report.entity");
const sales_client_payment_entity_1 = require("../entities/sales-client-payment.entity");
const client_stock_entity_1 = require("../entities/client-stock.entity");
const role_entity_1 = require("../entities/role.entity");
const getDatabaseConfig = (configService) => {
    const useLocalDb = configService.get('USE_LOCAL_DB', 'false') === 'true';
    const isProduction = configService.get('NODE_ENV', 'development') === 'production';
    if (isProduction) {
        console.log('🚀 Production environment - using MySQL database');
        return {
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT', 3306),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [
                sales_rep_entity_1.SalesRep, clients_entity_1.Clients, product_entity_1.Product, journey_plan_entity_1.JourneyPlan, login_history_entity_1.LoginHistory, uplift_sale_entity_1.UpliftSale, uplift_sale_item_entity_1.UpliftSaleItem,
                task_entity_1.Task, leave_entity_1.Leave, store_entity_1.Store, store_inventory_entity_1.StoreInventory, category_entity_1.Category, category_price_option_entity_1.CategoryPriceOption, order_entity_1.Order, order_item_entity_1.OrderItem, users_entity_1.Users, notice_entity_1.Notice, leave_type_entity_1.LeaveType,
                feedback_report_entity_1.FeedbackReport, product_report_entity_1.ProductReport, visibility_report_entity_1.VisibilityReport, sales_client_payment_entity_1.SalesClientPayment, client_stock_entity_1.ClientStock, role_entity_1.Role,
            ],
            synchronize: false,
            logging: configService.get('DB_LOGGING', false),
            charset: 'utf8mb4',
            ssl: configService.get('DB_SSL', false),
            extra: {
                connectionLimit: 20,
                charset: 'utf8mb4',
                multipleStatements: true,
                dateStrings: true,
            },
            retryAttempts: 5,
            retryDelay: 2000,
            connectTimeout: 60000,
            keepConnectionAlive: true,
            autoLoadEntities: true,
        };
    }
    console.log('🔧 Development environment - using MySQL database');
    return {
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
            sales_rep_entity_1.SalesRep, clients_entity_1.Clients, product_entity_1.Product, journey_plan_entity_1.JourneyPlan, login_history_entity_1.LoginHistory, uplift_sale_entity_1.UpliftSale, uplift_sale_item_entity_1.UpliftSaleItem,
            task_entity_1.Task, leave_entity_1.Leave, store_entity_1.Store, store_inventory_entity_1.StoreInventory, category_entity_1.Category, category_price_option_entity_1.CategoryPriceOption, order_entity_1.Order, order_item_entity_1.OrderItem, users_entity_1.Users, notice_entity_1.Notice, leave_type_entity_1.LeaveType,
            feedback_report_entity_1.FeedbackReport, product_report_entity_1.ProductReport, visibility_report_entity_1.VisibilityReport, sales_client_payment_entity_1.SalesClientPayment, client_stock_entity_1.ClientStock, role_entity_1.Role,
        ],
        synchronize: false,
        logging: configService.get('DB_LOGGING', false),
        charset: 'utf8mb4',
        ssl: configService.get('DB_SSL', false),
        extra: {
            connectionLimit: 20,
            charset: 'utf8mb4',
            multipleStatements: true,
            dateStrings: true,
        },
        retryAttempts: 5,
        retryDelay: 2000,
        connectTimeout: 60000,
        keepConnectionAlive: true,
        autoLoadEntities: true,
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map