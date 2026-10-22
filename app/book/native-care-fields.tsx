import { defaultBusiness, type BusinessConfig } from "@/lib/business-config";
import { vehicleSizes } from "@/lib/service-menu";
import { ENVIRONMENT_OPTIONS, UTILITY_OPTIONS } from "./view";

/** No-JavaScript fallback for the inquiry selections. Each group posts as
 * repeated native fields; the intake route collects them into string arrays. */
export default function NativeCareFields({ business = defaultBusiness() }: { business?: BusinessConfig }) {
  return (
    <>
      <fieldset>
        <legend>Which care should we discuss?</legend>
        {business.services.filter((service) => service.visible).map((service) => (
          <label key={service.id}>
            <input type="checkbox" name="services" value={service.id} />
            {service.name}
          </label>
        ))}
      </fieldset>
      <label htmlFor="native-tier">Vehicle size</label>
      <select id="native-tier" name="tier" defaultValue="">
        <option value="">Choose</option>
        {vehicleSizes.map((size) => (
          <option key={size.value} value={size.value}>{size.label}</option>
        ))}
      </select>
      <fieldset>
        <legend>Where will the car be? (optional)</legend>
        {ENVIRONMENT_OPTIONS.map((option) => (
          <label key={option.id}>
            <input type="checkbox" name="environment" value={option.id} />
            {option.label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>What can we use? (optional)</legend>
        {UTILITY_OPTIONS.map((option) => (
          <label key={option.id}>
            <input type="checkbox" name="utilities" value={option.id} />
            {option.label}
          </label>
        ))}
      </fieldset>
    </>
  );
}
