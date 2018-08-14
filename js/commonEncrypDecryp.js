var keyStr = CryptoJS.enc.Latin1.parse("EE0D09B46AEA496EA184EA69763CF6A6");

/**
 * 加密数据
 * 
 * @param {type}
 *            data 待加密的字符串
 * @param {type}
 *            keyStr 秘钥
 * @param {type}
 *            ivStr 向量
 * @returns {unresolved} 加密后的数据
 */
var aesEncrypt = function(data) {
	var sendData = CryptoJS.enc.Utf8.parse(data);
	var encrypted = CryptoJS.AES.encrypt(sendData, keyStr, {
		mode : CryptoJS.mode.ECB,
		padding : CryptoJS.pad.Pkcs7
	});
	return encrypted;
};

