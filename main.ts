function PantallaDades () {
    OLED.clear()
    OLED.writeStringNewLine("TDR")
    OLED.newLine()
    OLED.writeStringNewLine("Temperatura: " + ("" + temperatura) + " C")
    OLED.writeStringNewLine("Humitat: " + ("" + Humitat) + "%")
    OLED.writeStringNewLine("Pressio: " + ("" + Pressió) + " hPa")
    OLED.writeStringNewLine("Bateria: " + ("" + PercBat) + "%")
    OLED.writeStringNewLine("Voltatge:  " + ("" + batvolt) + " V")
}
input.onButtonPressed(Button.A, function () {
    Sos()
})
function Wifi () {
    botoapretat = 0
    while (botoapretat == 0) {
        if (input.buttonIsPressed(Button.A)) {
            botoapretat += 1
            SSID = "MAZINGERZ"
            WIFI_PASSWORD = "letsthesunshine"
        }
        if (input.buttonIsPressed(Button.B)) {
            botoapretat += 1
            SSID = "orioloneplusnord"
            WIFI_PASSWORD = "bondia1234"
        }
    }
    OLED.clear()
    ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
    ESP8266_IoT.connectWifi(SSID, WIFI_PASSWORD)
    OLED.writeStringNewLine("Connectat")
}
function LlegirDades () {
    temperatura = BME280.temperature(BME280_T.T_C)
    Humitat = BME280.humidity()
    Pressió = BME280.pressure(BME280_P.hPa)
}
function EnviarDades () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "8OUGW8MHUV093H5B",
    temperatura,
    Humitat,
    Pressió,
    PercBat,
    batvolt,
    sos
    )
    ESP8266_IoT.uploadData()
}
function Sos () {
    pantalla = 1
    basic.pause(15000)
    sos = 1
    EnviarDades()
    sos = 0
    basic.pause(15000)
    EnviarDades()
    basic.pause(2000)
    pantalla = 0
}
function VoltatgeBateria () {
    batvolt = 0
    for (let index = 0; index < 100; index++) {
        batvolt += pins.analogReadPin(AnalogPin.P1)
    }
    batvolt = batvolt / 100 * 3.16 / 1023 * 110 / 10
    PercentatgeBat()
}
function PercentatgeBat () {
    if (batvolt >= 4.2) {
        PercBat = 100
    }
    if (batvolt < 4.2 && batvolt >= 4) {
        PercBat = 80
    }
    if (batvolt < 4 && batvolt >= 3.9) {
        PercBat = 60
    }
    if (batvolt < 3.9 && batvolt >= 3.8) {
        PercBat = 40
    }
    if (batvolt < 3.8 && batvolt >= 3.7) {
        PercBat = 20
    }
}
function PantallaSos () {
    OLED.clear()
    OLED.newLine()
    OLED.writeStringNewLine("SOS")
}
let WIFI_PASSWORD = ""
let SSID = ""
let botoapretat = 0
let batvolt = 0
let PercBat = 0
let Pressió = 0
let Humitat = 0
let temperatura = 0
let sos = 0
let pantalla = 0
OLED.init(128, 64)
OLED.writeStringNewLine("TDR")
OLED.newLine()
OLED.writeStringNewLine("A - WIFI CASA")
OLED.writeStringNewLine("B - WIFI MOBIL")
OLED.newLine()
Wifi()
pantalla = 0
basic.pause(1000)
LlegirDades()
VoltatgeBateria()
pantalla = 0
sos = 0
basic.forever(function () {
    LlegirDades()
    VoltatgeBateria()
    if (pantalla == 0) {
        PantallaDades()
        basic.pause(2000)
    }
    if (pantalla == 1) {
        PantallaSos()
    }
})
basic.forever(function () {
    EnviarDades()
    basic.pause(900000)
})
