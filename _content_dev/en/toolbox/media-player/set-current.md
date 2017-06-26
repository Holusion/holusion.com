---
title: Control the display with Python
abstract: Use  the Holusion API to control your product

---
# Use the playlist
We will make a function in Python that will display the list of medias and will permit to select an element in the playlist to play it.

## The display

First of all, we will recover the whole playlist and display it with the ncurses librairy :

    #!/usr/bin/env python
    import curses
    import requests

    medias = requests.get("http://192.168.1.46/playlist").json()

    # init curses #
    screen = curses.initscr()
    curses.noecho()
    curses.cbreak()
    screen.keypad(True)
    screen.addstr("Press Arrow keys or Esc.")

    index = 0
    for media in medias:
        if media.get("active") :
            screen.addstr(index+1,2,media.get("name"),curses.A_REVERSE)
        else:
            screen.addstr(index+1,2,media.get("name"))
        index = index+1
        screen.refresh()

    screen.move(0,curses.COLS - 1)
    while 1:
        c = screen.getch()
        if c == 27: #Escape
            break;
    curses.nocbreak()
    screen.keypad(False)
    curses.echo()
    curses.endwin()

If we run the programm, it will display the list of medias while making the difference between activated and desactivated medias.

Then we will use a new route : `[PUT] /control/current/{name}`. In the [HTTP standard](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html), the PUT method corresponds to a creation of resources. We send the name of the media we want to display to the server.

The use of a PUT request is often more complex than with a GET.

With the requests librairy :

    name= "my_media_name"
    req = requests.put('http://10.0.0.1/control/current/'+name)
    if req.status_code != 200:
      print(req.text) # fail
    else:
      print("OK") # success

If we try this code, the request fails : "my_media_name" isn't present in the available medias.

From this 2 requests we can now create an application permitting to drive the holograms with the keyboard's arrows :

    #!/usr/bin/env python
    import curses
    import requests
    ip = "10.0.0.1"
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

To go further, we can desactivate the rest of the playlist to loop on the selected element : [Desactivate the elements](modify-elements)
