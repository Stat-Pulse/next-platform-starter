export default function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-md text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
