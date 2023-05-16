#include <string>
#include <vector>
#include <queue>
#include <optional>
#include <stdio.h>
#include <wajic.h>

#define self (*this)

using namespace std;

// 2d vector
class Vec2{
public:
	int x, y;
	Vec2(int x, int y)
		: x(x)
		, y(y)
	{}
	bool operator==(const Vec2 &other) const {
		return self.x == other.x && self.y == other.y;
	}
	bool operator!=(const Vec2 &other) const {
		return !(self == other);
	}
	Vec2 operator+(const Vec2 &other) const {
		return Vec2(self.x + other.x, self.y + other.y);
	}
	Vec2 operator-() const {
		return Vec2(-self.x, -self.y);
	}
	Vec2 operator-(const Vec2 &other) const {
		return self + (-other);
	}
	Vec2 operator*(int multiplier) const {
		return Vec2(self.x * multiplier, self.y * multiplier);
	}
};

// 以东、南为X、Y轴正向
const Vec2 NORTH = Vec2(0, -1);
const Vec2 SOUTH = Vec2(0, 1);
const Vec2 WEST = Vec2(-1, 0);
const Vec2 EAST = Vec2(1, 0);

template <class Tile>
class Map2{
public:
	Vec2 dim; // 地图的长宽
	vector<Tile> value; // 图块能不能走
	Map2(Vec2 dim)
		: dim(dim)
		, value(vector<Tile>(dim.x * dim.y))
	{}
	bool in(const Vec2 &pos) const {
		return 0 <= pos.x && pos.x < self.dim.x && 0 <= pos.y && pos.y < self.dim.y;
	}
	int to_index(const Vec2 &pos) const {
		return self.dim.x * pos.y + pos.x;
	}
	Tile get(const Vec2 &pos) const {
		return self.value[self.to_index(pos)];
	}
	void set(const Vec2 &pos, const Tile &value){
		self.value[self.to_index(pos)] = value;
	}
};

struct SolveResult{
	optional<vector<Vec2>> path;
	optional<vector<pair<Vec2, int>>> visit_order;
};

SolveResult solve_maze(const Map2<bool> &map, Vec2 start, Vec2 end){
	queue<Vec2> scheduled_visit;
	scheduled_visit.push(start);
	auto previous = Map2<optional<Vec2>>(map.dim); // 记录到某一格的路上一格是哪里
	previous.set(start, start);
	auto distance = Map2<optional<int>>(map.dim); // 记录离原点的距离，方便可视化
	distance.set(start, 0);
	auto visit_order = vector<pair<Vec2, int>>(); // 访问的顺序和离原点的距离
	visit_order.push_back(make_pair(start, 0));
	bool has_path = false;
	while (!scheduled_visit.empty()){
		Vec2 current = scheduled_visit.front();
		scheduled_visit.pop();
		if (current == end){
			has_path = true;
			break;
		}
		for (auto direction : {NORTH, SOUTH, WEST, EAST}){
			Vec2 target = current + direction;
			if (map.in(target) && !map.get(target) && !bool(previous.get(target))){
				// 可以往这里走
				//printf("visiting %d, %d", target.x, target.y);
				previous.set(target, optional<Vec2>(current)); // 记录已经走过了，不要让重复走圈圈进入死循环
				distance.set(target, *distance.get(current)+1);
				visit_order.push_back(make_pair(target, *distance.get(current)+1));
				scheduled_visit.push(target);
			}
		}
	}
	if (!has_path){
		return {{}, visit_order};
	}
	vector<Vec2> path;
	Vec2 current = end;
	// 从end开始回溯
	while (true){
		path.push_back(current);
		if (previous.get(current) && current != *previous.get(current)){
			current = *previous.get(current);
		} else {
			break; // 回溯完了
		}
	}
	return {path, visit_order};
}



// 给前端js接口的wrapper函数

Map2<bool> map(Vec2(0, 0));
optional<vector<Vec2>> result_path;
optional<vector<pair<Vec2, int>>> result_visit_order;

WA_EXPORT(wrapped_set_dim) void wrapped_set_dim(int x, int y) {
	map = Map2<bool>(Vec2(x, y));
}

WA_EXPORT(wrapped_set_tile) void wrapped_set_tile(int x, int y, bool value) {
	map.set(Vec2(x, y), value);
}
WA_EXPORT(solve_maze_wrapped) void solve_maze_wrapped(int start_x, int start_y, int end_x, int end_y) {
	auto result = solve_maze(map, Vec2(start_x, start_y), Vec2(end_x, end_y));
	result_path = result.path;
	result_visit_order = result.visit_order;
}
WA_EXPORT(get_result_path_x) int get_result_path_x(int i) {
	if (!result_path || result_path->size() <= i){
		return -1;
	}
	return (*result_path)[i].x;
}
WA_EXPORT(get_result_path_y) int get_result_path_y(int i) {
	if (!result_path || result_path->size() <= i){
		return -1;
	}
	return (*result_path)[i].y;
}
WA_EXPORT(get_result_visit_order_x) int get_result_visit_order_x(int i) {
	if (!result_visit_order || result_visit_order->size() <= i){
		return -1;
	}
	return (*result_visit_order)[i].first.x;
}
WA_EXPORT(get_result_visit_order_y) int get_result_visit_order_y(int i) {
	if (!result_visit_order || result_visit_order->size() <= i){
		return -1;
	}
	return (*result_visit_order)[i].first.y;
}

WA_EXPORT(get_result_visit_order_distance) int get_result_visit_order_distance(int i) {
	if (!result_visit_order || result_visit_order->size() <= i){
		return -1;
	}
	return (*result_visit_order)[i].second;
}

int main(){
	printf("working\n");
	return 0;
}
