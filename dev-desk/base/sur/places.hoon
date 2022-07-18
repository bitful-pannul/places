::  places: anonymous locations from friends of friends
::  
|%
+$  places  (list place)
+$  place 
    $|  [lat=@rd long=@rd desc=tape]  validate
::  
++  validate
    |=  [lat=@rd long=@rd desc=tape]   
      ?&  
      (gte:ma:rd lat .~-90)    (lte:ma:rd lat .~90)
      (gte:ma:rd long .~-180)  (lte:ma:rd long .~180)
      ==
::  currently lat and long are turned into tapes "~12.1234567" when
::  converted to json. reason being the weirdness of @rd parsing from
::  knots and others... up for suggestions
::
::  list of encode => decode functions for my stored @rd coordinates...
::  n. 1 [(tape:enjs:format +:(slag 0 (scow %rd .~1.123))) =>
::  (scan "~1.123" royl-rd:so)
::  n.2 (tape:enjs:format (scow %rd .~1.123)) =>
::  `@rd`((se:dejs:format %rd) (json [%s '.~1.123']))
::
++  to-jason
  |=  plc=place
  ^-  json
  %-  pairs:enjs:format
  :~
     ['lat' (tape:enjs:format +:(slag 0 (scow %rd lat.plc)))]
     ['long' (tape:enjs:format +:(slag 0 (scow %rd long.plc)))]
     ['desc' (tape:enjs:format desc.plc)]
  ==
::
++  from-jason
  |=  jon=json
  ^-  place
  %-  tape-to-rd
  %.  jon
  %-  ot:dejs:format
  :~
     [%lat sa:dejs:format]
     [%long sa:dejs:format]
     [%desc sa:dejs:format]
  ==
:: helper to convert stuff back into @rd inside dejs:format
++  tape-to-rd
  |=  [lat=tape long=tape desc=tape]
  ^-  place
  :+
    [(scan lat royl-rd:so)]
    [(scan long royl-rd:so)]
    [desc]
::  exact same methods but for multiple places 
++  places-to-jason
  |=  plcs=places
  ^-  json
  %-  pairs:enjs:format
  :~
    ['places' a+(turn plcs to-jason)]
  ==
::  be careful with =,  dejs:format, "at" is defined in hoon already!
::
++  places-from-jason
  |=  jon=json
  =,  dejs:format
  ^-  places
  =-  (turn - tape-to-rd)
  %.  jon
  %-  ot
  :~
    [%places (ar (ot ~[lat+sa long+sa desc+sa]))]
  ==
--
