function lectura_de_dades () {
    temperatura = BME280.temperature(BME280_T.T_C)
    Humitat = BME280.humidity()
    Pressió = BME280.pressure(BME280_P.hPa)
    intensitat = pins.analogReadPin(AnalogPin.P1)
}
input.onButtonPressed(Button.A, function () {
    pantalla += 1
})
function pantalla_amb_dades () {
    OLED.clear()
    OLED.writeStringNewLine("TDR")
    OLED.newLine()
    OLED.writeStringNewLine("Temperatura: " + temperatura + " C")
    OLED.writeStringNewLine("Humitat: " + Humitat + "%")
    OLED.writeStringNewLine("Pressio: " + Pressió + " hPa")
    OLED.writeStringNewLine("Intensitat: " + intensitat + " mA")
}
function Voltatge_bateria () {
    batvolt = 0
    for (let index = 0; index < 10; index++) {
        batvolt += BME280.temperature(BME280_T.T_C)
    }
    batvolt = batvolt / 10
}
let batvolt = 0
let intensitat = 0
let Pressió = 0
let Humitat = 0
let temperatura = 0
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
basic.pause(1000)
let pantalla = 1
basic.forever(function () {
    lectura_de_dades()
    if (pantalla == 1) {
        pantalla_amb_dades()
        basic.pause(2000)
    }
    if (pantalla == 2) {
        OLED.clear()
        OLED.writeStringNewLine("TDR")
        OLED.newLine()
        OLED.writeStringNewLine("BATERIA")
        Voltatge_bateria()
        OLED.writeStringNewLine("Volt " + batvolt)
        basic.pause(2000)
    }
    if (pantalla > 2) {
        pantalla = 1
    }
})
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    if (ESP8266_IoT.thingSpeakState(true)) {
        Voltatge_bateria()
        ESP8266_IoT.setData(
        "8OUGW8MHUV093H5B",
        temperatura,
        Humitat,
        Pressió,
        intensitat,
        batvolt
        )
        ESP8266_IoT.uploadData()
    } else {
        OLED.clear()
        OLED.writeStringNewLine("TDR")
        OLED.newLine()
        OLED.writeStringNewLine("ERROR DADES")
    }
    basic.pause(300000)
})
