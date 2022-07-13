::  places: anonymous locations from friends of friends
::  
|%
+$  place   [lat=@sd long=@sd desc=tape]
+$  places  (list place)
+$  coordinate  
    $|  [lat=@rd long=@rd]  validate
::  
++  validate
    |=  [lat=@rd long=@rd]  
      ?&  
      (gte:ma:rd lat .~-90)    (lte:ma:rd lat .~90)
      (gte:ma:rd long .~-180)  (lte:ma:rd long .~180)
      ==
::  ++  from-json
::  |=  jon=json
::  ot? of? ne:dejs:format for %n to @rd, sa:dejs:format for %s to tape
::
::  ++  to-json
::  |=  plc=place
::
::  figure out incoming single place poke first, then scries for list
::  of places
--

