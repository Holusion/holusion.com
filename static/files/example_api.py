#!/usr/bin/env python
import curses
import requests
ip = "192.168.1.46"
medias = requests.get("http://"+ip+"/playlist").json()
cursor = 0

# init curses #
screen = curses.initscr()
curses.noecho()
curses.cbreak()
screen.keypad(True)
screen.addstr("Press Arrow keys or Esc.")

index = 0
for media in medias:
    if media.get("active") :
        screen.addstr(index+1,2,media.get("name"))
    else:
        screen.addstr(index+1,2,media.get("name"))
    index = index+1
    screen.refresh()

screen.move(cursor+1,0)
while 1:
    screen.addstr(cursor+1,2,medias[cursor].get("name"),curses.A_REVERSE)
    screen.refresh()
    c = screen.getch()
    if c == curses.KEY_UP:
        screen.addstr(cursor+1,2,medias[cursor].get("name"))
        cursor = cursor - 1
    elif c == curses.KEY_DOWN:
        screen.addstr(cursor+1,2,medias[cursor].get("name"))
        cursor = cursor + 1
    elif c == 27: #Escape
        break;
    elif c == 10:
        req = requests.put('http://'+ip+'/control/current/'+medias[cursor].get("name"))
        if req.status_code != 200:
            screen.addstr(0,30,req.text)
        else:
            screen.addstr(0,30,"OK")
    else:
        screen.addstr(0,30,"Pressed : "+str(c))
    if cursor <0:
        cursor = len(medias)-1
    elif len(medias) <= cursor:
        cursor = 0
curses.nocbreak()
screen.keypad(False)
curses.echo()
curses.endwin()
