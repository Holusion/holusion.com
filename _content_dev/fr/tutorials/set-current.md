---
title: Utiliser l'API de contrôle
abstract: Utilisez l'API Holusion pour contrôler l'affichage de votre produit
rank: 6
---

# Utiliser l'API de contrôle

Nous allons réaliser un programme en python qui affichera la liste des médias et permettra de séléctionner un élément de la playlist pour le lire. Il est préférable de connaitre quelques bases de l'[API en question](/dev/fr/references/control-api) avant de commencer.

Il est nécessaire d'être [connecté](/dev/fr/how-to/connect-router) à un produit fonctionnel disposant déjà de [contenus](/dev/fr/media-transfer) pour réaliser ce tutoriel.

Ce guide utilise [python](https://www.python.org/), avec les librairies [curses](https://docs.python.org/3/library/curses.html) et [request](https://fr.python-requests.org/en/latest/).

Une documentation complète de l'API utilisée ici est disponible en [référence](/dev/fr/references/control-api), mais il n'est pas nécessaire de la connaitre pour achever ce tutoriel.

## L'affichage

Tout d'abord, nous allons récupérer l'ensemble de la playlist et l'afficher avec la librairie ncurses :

    #!/usr/bin/env python
    import curses
    import requests

    medias = requests.get("http://192.168.1.100/playlist").json()

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

Si l'on lance le programme, il affichera la liste des médias en différenciant ceux qui sont activés de ceux qui sont désactivés.

Nous allons ensuite utiliser une nouvelle route : `[PUT] /control/current/{name}`. Dans le [standard HTTP](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html), la péthode PUT correspond à une création de ressource. On envoie au serveur le nom du média qu'on souhaite afficher.

La création d'une requête PUT est souvent un peu plus compliquée qu'un GET.

Avec la librairie requests :

{% highlight python %}
name= "my_media_name"
req = requests.put('http://10.0.0.1/control/current/'+name)
if req.status_code != 200:
    print(req.text) # échec
else:
    print("OK") # succès
{% endhighlight %}


Si l'on essaie ce code, la requête échoue : "my_media_name" n'est pas présent dans les médias disponibles.

On peut à partir de ces 2 requêtes créer une application permettant de piloter les hologrammes à partir des flèches directionnelles du clavier :

    #!/usr/bin/env python
    import curses
    import requests
    ip = "192.168.1.129"
    medias = requests.get("http://"+ip+"/playlist").json()
    cursor = 0
    offset= 0

    # init curses #
    screen = curses.initscr()
    curses.noecho()
    curses.cbreak()
    screen.keypad(True)
    screen.addstr("Press Arrow keys or Esc.")


    def display_media(offset):
    	cursor=0
    	screen.clear()
    	screen.addstr("Press Arrow keys or Esc.")
    	index=0
    	for media in medias[offset:15+offset]:
    		if media.get("active") :
           			screen.addstr(index+1,2,media.get("name"))
    		else:
    			screen.addstr(index+1,2,media.get("name"),curses.A_REVERSE))
    		index = index+1
    		screen.refresh()

    	screen.move(cursor+1,0)

    display_media(offset)
    while 1:
        screen.addstr(cursor+1,2,medias[cursor+offset].get("name"),curses.A_REVERSE)
        screen.refresh()
        c = screen.getch()
        if c == curses.KEY_UP and cursor>0:
            screen.addstr(cursor+1,2,medias[cursor+offset].get("name"))
            cursor = cursor - 1
        elif c == curses.KEY_DOWN and cursor<14:
            screen.addstr(cursor+1,2,medias[cursor+offset].get("name"))
            cursor = cursor + 1
        elif c == curses.KEY_RIGHT and len(medias)<offset+15:
            offset = offset+15
            display_media(offset)
        elif c == curses.KEY_LEFT and offset>=15:
            offset = offset-15
            display_media(offset)
        elif c == 27: #Escape
            break;
        elif c == 10:
            req = requests.put('http://'+ip+'/control/current/'+medias[cursor+offset].get("name"))
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

