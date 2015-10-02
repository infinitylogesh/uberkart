import sys
import usb.core
import usb.util
import urllib2
from time import gmtime, strftime

hid = { 4: 'a', 5: 'b', 6: 'c', 7: 'd', 8: 'e', 9: 'f', 10: 'g', 11: 'h', 12: 'i', 13: 'j', 14: 'k', 15: 'l', 16: 'm', 17: 'n', 18: 'o', 19: 'p', 20: 'q', 21: 'r', 22: 's', 23: 't', 24: 'u', 25: 'v', 26: 'w', 27: 'x', 28: 'y', 29: 'z', 30: '1', 31: '2', 32: '3', 33: '4', 34: '5', 35: '6', 36: '7', 37: '8', 38: '9', 39: '0', 44: ' ', 45: '-', 46: '=', 47: '[', 48: ']', 49: '\\', 51: ';' , 52: '\'', 53: '~', 54: ',', 55: '.', 56: '/'  }

dev = usb.core.find(idVendor=0x13ba, idProduct=0x0018)

if dev is None:
    raise ValueError('Device not found')

if dev.is_kernel_driver_active(0):
    reattach = True
    dev.detach_kernel_driver(0)

dev.set_configuration()

# get an endpoint instance
cfg = dev.get_active_configuration()
intf = cfg[(0,0)]
ep = intf[0]

barcode = ''


def transmitBarcode(barcode): 
    sys.stdout.write(barcode)
    sys.stdout.flush() #to flush the output of stdout buffer.
	# url = "http://52.26.96.210:8080/?upc=" + barcode
	# print strftime("%Y-%m-%d %H:%M:%S")
	# request = urllib2.Request(url)
	# response = urllib2.urlopen(request)
	# print response.read()

booleanvar = 0;

while 1:
    try:
        data = dev.read(ep.bEndpointAddress,ep.wMaxPacketSize)
        for x in data:
            if hid.has_key(x):
                barcode += str(hid[x])
            elif x==40:
                transmitBarcode(barcode)
                barcode = ''
    except usb.core.USBError as e:
        data = None
        if e.args == ('Operation timed out',):
            continue


# release the device
usb.util.release_interface(dev, intf)
# reattach the device to the OS kernel
dev.attach_kernel_driver(0)


