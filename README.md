# engine-signature
ML engine diagnosing engine failure from engine sounds


# Create Virtual Env and connect Jupyter debugger
`python3 -m venv ./venv/`

`source ./venv/bin/activate`

`pip install ipykernel`
`pip install sklearn`

`python3 -m ipykernel install --user --name=engine_signature`

In `compare_csv.py` notice the #%%, vs code uses this as Jupyter notebook cells and when you click "Run Cell" it should open a window on the right called: "Interactive-1" or something along those lines.

Below the 3 dots there should be a env version (Python 3.8.1 or along those lines). Click it to change the kernel to the env you just created, there should be a list, includingg the "engine_signature" env you just created, select that and your jupyter notebook should be configured with the new venv you just created. This will allow you to debug, run cells, and see output interactively.

