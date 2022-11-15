function PantallaDades () {
    OLED.clear()
    OLED.writeStringNewLine("TDR")
    OLED.newLine()
    OLED.writeStringNewLine("Temperatura: " + ("" + temperatura) + " C")
    OLED.writeStringNewLine("Humitat: " + ("" + Humitat) + "%")
    OLED.writeStringNewLine("Pressio: " + ("" + Pressió) + " hPa")
    OLED.writeStringNewLine("Bateria" + ("" + PercBat) + "%")
    OLED.writeStringNewLine("Voltatge:  " + ("" + batvolt) + " V")
}
input.onButtonPressed(Button.A, function () {
    Sos()
})
function LlegirDades () {
    temperatura = BME280.temperature(BME280_T.T_C)
    Humitat = BME280.humidity()
    Pressió = BME280.pressure(BME280_P.hPa)
    intensitat = pins.analogReadPin(AnalogPin.P1)
}
function EnviarDades () {
    ESP8266_IoT.connectThingSpeak()
    if (ESP8266_IoT.thingSpeakState(true)) {
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
    } else {
        OLED.clear()
        OLED.writeStringNewLine("TDR")
        OLED.newLine()
        OLED.writeStringNewLine("ERROR DADES")
    }
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
    batvolt = batvolt / 100 * 3.125 / 1023 * 110 / 10
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
    if (batvolt < 3.7) {
        PercBat = 0
    }
}
function PantallaSos () {
    OLED.clear()
    OLED.newLine()
    OLED.newLine()
    OLED.newLine()
    OLED.writeStringNewLine("SOS")
    OLED.writeStringNewLine("Enviant dades...")
}
let intensitat = 0
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
pantalla = 0
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("orioloneplusnord", "bondia1234")
if (ESP8266_IoT.wifiState(true)) {
    OLED.writeStringNewLine("Connectat")
} else {
    OLED.writeStringNewLine("No connectat")
}
LlegirDades()
VoltatgeBateria()
basic.pause(1000)
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
