router.get("/", haveAptKey, aptController.getAptManagementView);
router.get("/kitchen", aptController.getKitchenView);

router.get("../", haveAptKey, haveFlashLight, aptController.getWashroomView);

// apt controller

/*
    Kitchen functions
                    */

// Cook
function cook(food, utensil, hotPlateOn = true) {
  // get food
  // get utensil
  // cook
  // return cooked food
}
// Clean
// get Food - model call (aptModel.getFood())
// eat
