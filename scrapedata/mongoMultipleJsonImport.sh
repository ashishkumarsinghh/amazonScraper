for filename in *; do mongoimport --jsonArray --db amazon --collection bestsellers --file $filename; echo $filename; done
