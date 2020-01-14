
import { request, axiosByJson,o_axiosByJson } from './https'
// import fetch from './common/js/fetch'

// http://yydc.qiluhospital.com/patientOrdering.api/api/Patient/GetOpenid
export const getOpenid = (authCode, opencode, pageURL = "/Sindex") => request('api/StaffOrder/GetOpenid', {
    authCode: authCode,
    code: opencode,
    pageURL
});

export const getStaffInfo = () => request('api/StaffOrder/GetStaffInfo', {});

//绑定
export const bindingStaff = (params) => request('api/StaffOrder/BindingStaff', { ...params });

// 解绑
export const bindingDelete = () => request('api/StaffOrder/BindingDelete', {});


export const getCompanyList = () => request('api/StaffOrder/GetCompanyList', {});

export const getSmsCode = (phone) => request('api/StaffOrder/GetSmsCode', {
    'mobile': phone
});

// 设置营养标准
export const nutritionStandard = (params) => request('api/StaffOrder/NutritionStandard', { ...params });

// 获取店铺列表
export const getShopList = () => request('api/StaffOrder/GetShopList', {});


export const getRepastList = (shopId, orderDate) => request('api/StaffOrder/GetRepastList', {
    shopId,
    orderDate
});

// 获取菜谱数据
export const getMenuList = (shopId, orderDate) => request('api/StaffOrder/GetMenuList', {
    shopId,
    orderDate
});

// 获取营养标准
export const getStandardNutrition = () => request('api/StaffOrder/GetStandardNutrition', {});

// 获取支付方式
export const getPaymentList = (shopId) => request('api/StaffOrder/GetPaymentList', { shopId });

// 设置地址信息
export const staffAddress = (params) => request('api/StaffOrder/StaffAddress', { ...params });

// 获取地址信息
export const getAddressList = (shopId) => request('api/StaffOrder/GetAddressList', { shopId });




// 查看订单详情
export const getOrderDetail = (orderId) => request('api/StaffOrder/GetOrderDetail', {
    'authCode': '101FCC56AB9147F69E75AC7AAC52D2BB',
    orderId
});

// 取消订单
export const orderCancel = (orderId) => request('api/StaffOrder/OrderCancel', {
    'authCode': '101FCC56AB9147F69E75AC7AAC52D2BB',
    orderId
});

export const orderPaid = (orderId) => request('api/StaffOrder/OrderPaid', {
    'authCode': '101FCC56AB9147F69E75AC7AAC52D2BB',
    orderId,
    payId: '',
    tradeId: ''
});


// json提交
export const getPrepayid = (params) => axiosByJson('api/StaffOrder/GetPrepayid', { ...params });
export const submitOrder = (params) => axiosByJson('api/StaffOrder/SubmitOrder', { ...params });
// 获取订单列表
export const getOrderList = (pageSize, pageNum) => o_axiosByJson('api/StaffOrder/GetOrderList', {
    'authCode': '101FCC56AB9147F69E75AC7AAC52D2BB',
    pageSize,
    pageNum
});
