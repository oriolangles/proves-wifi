let intensitat = 0
OLED.init(128, 64)
OLED.writeStringNewLine("TDR")
OLED.newLine()
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("MAZINGERZ", "letsthesunshine")
if (ESP8266_IoT.wifiState(true)) {
    OLED.writeStringNewLine("Connectat")
} else {
    OLED.writeStringNewLine("No connectat")
}
basic.forever(function () {
    intensitat = pins.analogReadPin(AnalogPin.P1)
    ESP8266_IoT.connectThingSpeak()
    if (ESP8266_IoT.thingSpeakState(true)) {
        ESP8266_IoT.setData(
        "8OUGW8MHUV093H5B",
        BME280.temperature(BME280_T.T_C),
        BME280.humidity(),
        BME280.pressure(BME280_P.hPa),
        intensitat
        )
        OLED.clear()
        OLED.writeStringNewLine("TDR")
        OLED.newLine()
        OLED.writeStringNewLine("Temperatura: " + BME280.temperature(BME280_T.T_C) + " C")
        OLED.writeStringNewLine("Humitat: " + BME280.humidity() + "%")
        OLED.writeStringNewLine("Pressio: " + BME280.pressure(BME280_P.hPa) + " hPa")
        OLED.writeStringNewLine("Intensitat: " + intensitat + " mA")
        ESP8266_IoT.uploadData()
    } else {
        OLED.clear()
        OLED.writeStringNewLine("TDR")
        OLED.newLine()
        OLED.writeStringNewLine("ERROR DADES")
    }
    basic.pause(5000)
})
