---
title: Contrôler l'affichage en python
abstract: Utilisez l'API Holusion pour contrôler votre produit

---
# Utiliser la playlist
Nous allons réaliser un programme en python qui affichera la liste des médias et permettra de séléctionner un élément de la playlist pour le lire.

## L'affichage

Tout d'abord, nous allons récupérer l'ensemble de la playlist et l'afficher avec la librairie ncurses :

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

Si l'on lance le programme, il affichera la liste des médias en différenciant ceux qui sont activés de ceux qui sont désactivés.

Nous allons ensuite utiliser une nouvelle route : `[PUT] /control/current/{name}`. Dans le [standard HTTP](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html), la péthode PUT correspond à une création de ressource. On envoie au serveur le nom du média qu'on souhaite afficher.

La création d'une requête PUT est souvent un peu plus compliquée qu'un GET.

Avec la librairie requests :

    name= "my_media_name"
    req = requests.put('http://10.0.0.1/control/current/'+name)
    if req.status_code != 200:
      print(req.text) # échec
    else:
      print("OK") # succès

Si l'on essaie ce code, la requête échoue : "my_media_name" n'est pas présent dans les médias disponibles.

On peut à partir de ces 2 requêtes créer une application permettant de piloter les hologrammes à partir des flèches directionelles du clavier :

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

Pour aller plus loin, on peut désactiver le reste de la playlist pour jouer en boucle l'élément sélectionné : [Désactiver des élements](modify-elements)
