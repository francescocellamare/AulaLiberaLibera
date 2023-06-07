#!/bin/bash

wget https://www.swas.polito.it/dotnet/orari_lezione_pub/RicercaAuleLiberePerFasceOrarie.aspx -O orari.html 

orari=(8:30 10:00 11:30 13:00 14:30 16:00 17:30 19:00 20:30)


for i in {0..7}
do  
  echo  "${orari[$i]}-${orari[$(($i + 1))]}"
  cat -E orari.html | grep Pagina_gv_AuleLibere_lbl_AuleLibere_$i | cut -d '>' -f 2 | cut -d '<' -f 1  >> orari.txt 
  echo -n ';' >> orari.txt
done