export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Fire Detection</h2>
      <select className="select-forest">
        <option value="none" selected disabled hidden>
          choose a forest
        </option>
        <option>forest 1</option>
        <option>forest 2</option>
        <option>forest 3</option>
        <option>forest 4</option>
      </select>
    </div>
  );
}
