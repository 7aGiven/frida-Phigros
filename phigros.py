import frida
import time



d = []



def handler(message,payload):
    d.append(message["payload"])


with open("phigros.js") as f:
    js = f.read()
device = frida.get_usb_device()
pid = device.spawn("com.PigeonGames.Phigros")
device.resume(pid)
time.sleep(1)
session = device.attach(pid)
script = session.create_script(js)
script.on("message", handler)
script.load()
input()
tmp = ""
with open("difficulty.csv", "w") as f:
    for item in d:
        if item["id"] == tmp:
            continue
        tmp = item["id"]
        for i in range(len(item["difficulty"])):
            item["difficulty"][i] = str(round(item["difficulty"][i], 1))
        f.write("%s,%s\n" % (item["id"][:-2], ",".join(item["difficulty"])))
